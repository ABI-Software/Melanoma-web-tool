import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class AnatomyShellLayer {
  constructor({ scene, offset }) {
    this.scene = scene;
    this.offset = offset;

    this.root = null;
    this.lines = null;
    this.selectable = [];
    this._baseMeshOpacity = 0.5;

    this.selectedMesh = null;
    this.hoveredMesh = null;
    this.selectionVisualEnabled = true;
  }

  async init() {
    const loader = new GLTFLoader();

    const gltf = await new Promise((resolve, reject) => {
      loader.load(
        `${import.meta.env.BASE_URL}data/scene.glb`,
        resolve,
        undefined,
        reject
      );
    });

    const root = gltf.scene?.children?.[0] ?? gltf.scene;
    if (!root) {
      throw new Error("scene.glb loaded but no root was found");
    }

    let linesNode = null;

    for (const child of root.children ?? []) {
      child.geometry?.computeVertexNormals?.();

      if (child.name === "Lines") {
        linesNode = child;
        continue;
      }

      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: "#E5B27F",
          specular: "#33334C",
          opacity: this._baseMeshOpacity,
          transparent: true,
          shininess: 20,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 5,
          polygonOffsetUnits: 5,
        });

        child.renderOrder = 1;
        this.selectable.push(child);
      }
    }

    if (linesNode?.geometry) {
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: false,
      });

      const lines = new THREE.LineSegments(linesNode.geometry, lineMat);
      lines.position.copy(linesNode.position);
      lines.rotation.copy(linesNode.rotation);
      lines.scale.copy(linesNode.scale);
      lines.renderOrder = 50;
      lines.frustumCulled = false;

      linesNode.visible = false;
      root.add(lines);
      this.lines = lines;
    }

    root.position.add(this.offset);
    this.scene.add(root);
    this.root = root;
  }

  setMode(mode) {
    const isSkinMode = mode === "skin";
    const isHeatmapMode = mode === "heatmap";

    // Show red selected highlight only in skin tool
    this.selectionVisualEnabled = isSkinMode;

    for (const mesh of this.selectable) {
      mesh.visible = true;

      if (mesh.material) {
        mesh.material.transparent = true;
        mesh.material.opacity = isSkinMode ? this._baseMeshOpacity : 0.01;
        mesh.material.depthWrite = !isHeatmapMode;
      }

      if (mesh !== this.selectedMesh && mesh.material?.color) {
        mesh.material.color.set("#E5B27F");
      }

      if (mesh !== this.selectedMesh && mesh.material?.emissive) {
        mesh.material.emissive.setHex(0x000000);
      }

      mesh.renderOrder = isHeatmapMode ? 5 : 1;
    }

    if (this.selectedMesh?.material) {
      if (this.selectionVisualEnabled && this.selectedMesh.material.color) {
        this.selectedMesh.material.color.setHex(0xff0000);
      } else if (this.selectedMesh.material.color) {
        // Keep selection internally in heatmap mode, but do not show red highlight
        this.selectedMesh.material.color.set("#E5B27F");
      }

      this.selectedMesh.material.opacity = isSkinMode ? this._baseMeshOpacity : 0.01;

      if (this.selectedMesh.material.emissive) {
        this.selectedMesh.material.emissive.setHex(0x000000);
      }
    }

    if (this.lines) {
      this.lines.visible = true;
      if (this.lines.material) {
        this.lines.material.opacity = isHeatmapMode ? 0.7 : 1;
      }
    }
  }

  hasSelection() {
    return Boolean(this.selectedMesh);
  }

  getSelectedMesh() {
    return this.selectedMesh;
  }

  selectMesh(mesh) {
    if (this.selectedMesh === mesh) return;

    if (this.selectedMesh?.material?.color) {
      this.selectedMesh.material.color.set("#E5B27F");
      this.selectedMesh.material.opacity = this._baseMeshOpacity;
    }
    if (this.selectedMesh?.material?.emissive) {
      this.selectedMesh.material.emissive.setHex(0x000000);
    }

    this.selectedMesh = mesh ?? null;

    if (this.selectedMesh?.material?.color) {
      if (this.selectionVisualEnabled) {
        this.selectedMesh.material.color.setHex(0xff0000);
      } else {
        this.selectedMesh.material.color.set("#E5B27F");
      }

      this.selectedMesh.material.opacity = this._baseMeshOpacity;
    }
  }

  clearSelection() {
    if (this.selectedMesh?.material?.color) {
      this.selectedMesh.material.color.set("#E5B27F");
      this.selectedMesh.material.opacity = this._baseMeshOpacity;
    }

    if (this.selectedMesh?.material?.emissive) {
      this.selectedMesh.material.emissive.setHex(0x000000);
    }

    this.selectedMesh = null;
  }

  getSelectedFocusInfo() {
    if (!this.selectedMesh?.geometry) return null;

    const center = this.getCenterPoint(this.selectedMesh);
    if (!center) return null;

    this.selectedMesh.geometry.computeBoundingSphere();
    const localRadius = this.selectedMesh.geometry.boundingSphere?.radius ?? 60;

    const scale = this.selectedMesh.getWorldScale(new THREE.Vector3());
    const maxScale = Math.max(scale.x, scale.y, scale.z, 1);
    const worldRadius = localRadius * maxScale;

    return {
      point: center.clone(),
      radius: worldRadius,
    };
  }

  getCenterPoint(mesh) {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();

    const center = new THREE.Vector3();
    geometry.boundingBox.getCenter(center);
    mesh.localToWorld(center);

    return center;
  }

  setVisible(visible) {
    if (this.root) {
      this.root.visible = visible;
    }
  }

  dispose() {
    if (!this.root) return;

    this.scene?.remove(this.root);
    this.root = null;
    this.lines = null;
    this.selectable = [];
    this.selectedMesh = null;
    this.hoveredMesh = null;
  }
}