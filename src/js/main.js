import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import testVertexShader from '../glsl/vertex.glsl';
import testFragmentShader from '../glsl/fragment.glsl';

const App = function () {
  let ww, wh;
  let renderer, scene, camera, light, controls;
  let isRequestRender = false;
  let clock;
  let geometry, material, model;

  const $container = document.querySelector('.container');
  let $canvas;

  const init = function () {
    // Window
    ww = window.innerWidth;
    wh = window.innerHeight;

    // Scene
    scene = new THREE.Scene();

    // Renderer
    renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor('#000', 1.0);
    renderer.setSize(ww, wh);
    $canvas = renderer.domElement;
    $container.appendChild($canvas);

    // Camera
    camera = new THREE.PerspectiveCamera(70, ww / wh, 0.1, 1000);
    camera.position.set(0.25, -0.25, 1);
    scene.add(camera);

    // Light
    light = new THREE.AmbientLight('#fff', 1);
    scene.add(light);

    // Controls
    controls = new OrbitControls(camera, $canvas);
    controls.addEventListener('change', renderRequest);

    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Gui
    // gui = new dat.GUI();

    // Clock
    clock = new THREE.Clock();

    // Setting
    setModels();

    // Render
    renderRequest();
    render();

    // Loading
    THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
      if (itemsLoaded === itemsTotal) {
        //
      }
    };
  };

  const resize = function () {
    //
  };

  // Setting -------------------
  const setModels = function () {
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = textureLoader.load('/resources/textures/flag-french.jpg');

    geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
    material = new THREE.RawShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture },
      },
    });

    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    console.log(geometry.attributes.uv);

    model = new THREE.Mesh(geometry, material);
    model.scale.y = 2 / 3;
    scene.add(model);
  };

  // Render -------------------
  const renderRequest = function () {
    isRequestRender = true;
  };

  const render = function () {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    if (isRequestRender) {
      renderer.setSize(ww, wh);
      renderer.render(scene, camera);
    }
    window.requestAnimationFrame(render);
  };

  init();
  window.addEventListener('resize', resize);
};
window.addEventListener('load', App);
