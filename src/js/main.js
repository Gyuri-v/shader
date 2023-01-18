import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = function () {
  let ww, wh;
  let renderer, scene, camera, light, controls;
  let isRequestRender = false;
  // let sphere;

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
    camera.position.set(0, 0, 4);
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
    const attributes = {
      displacement: {
        type: 'f',
        value: [],
      },
    };

    const values = attributes.displacement.value;
    // const vertCount = 242;
    // for (var v = 0; v < vertCount; v++) {
    //   values.push(Math.random() * 30);
    // }

    // console.log(attributes);

    const shaderMaterial = new THREE.ShaderMaterial({
      attributes: attributes,
      // uniforms: {},
      vertexShader: `
        attribute float displacement;
        varying vec3 vNormal;
        void main()
        {
          vNormal = normal; 

          vec3 newPosition = position + normal * vec3(displacement);
        
          gl_Position = projectionMatrix *
                        modelViewMatrix *
                        vec4(newPosition, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal;
        void main()
        {
          vec3 light = vec3(0.5, 0.2, 1.0);
        
          light = normalize(light);
        
          float dProd = max(0.0, dot(vNormal, light));
        
          gl_FragColor = vec4(dProd, // R
                              dProd, // G
                              dProd, // B
                              1.0);  // A
        }`,
    });

    console.log(shaderMaterial);

    const sphereGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0]);
    sphereGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const sphere = new THREE.Mesh(sphereGeo, material);

    scene.add(sphere);
  };

  // Render -------------------
  const renderRequest = function () {
    isRequestRender = true;
  };

  const render = function () {
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
