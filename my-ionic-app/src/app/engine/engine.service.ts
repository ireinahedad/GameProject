import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Color3,
  Color4,
  DynamicTexture,
  Engine,
  FreeCamera,
  HemisphericLight,
  Light,
  Mesh,
  Scene,
  Space,
  StandardMaterial,
  Texture,
  Vector3,
  ActionManager,
  ExecuteCodeAction 
} from '@babylonjs/core';
import { WindowRefService } from './../services/window-ref.service';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas!: HTMLCanvasElement;
  //private canvas: HTMLCanvasElement = document.createElement('canvas');

  private engine!: Engine;
  private camera!: FreeCamera;
  private scene!: Scene;
  private light!: Light;
  private light2!: Light;
  private time: number = 0; 

  private sphere!: Mesh;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    
    private router: Router
  ) {}


  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas,  true);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.8, 0.9, 1, 1);

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    this.camera = new FreeCamera('camera1', new Vector3(0, 100, -10), this.scene);

    // target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    this.light.intensity = 1.5;
    this.light2 = new HemisphericLight('light2', new Vector3(0, 0, 1), this.scene);
    this.light2.intensity = 1.5;

    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    this.sphere = Mesh.CreateSphere('sphere1', 30 , 2, this.scene);

    // create the material with its texture for the sphere and assign it to the sphere
    
    const sphereMaterial = new StandardMaterial('paper_surface', this.scene);
    sphereMaterial.diffuseTexture = new Texture('./../../assets/textures/paper_texture.png', this.scene);
    sphereMaterial.bumpTexture = new Texture("./../../assets/textures/white-paper-texture-background.jpg" , this.scene);
    sphereMaterial.bumpTexture.level = 1; // Increase relief intensity


    sphereMaterial.invertNormalMapX = true;
    sphereMaterial.invertNormalMapY = true;

    this.sphere.material = sphereMaterial;
    this.setCloudBackground();

    // move the sphere upward 1/2 of its height
    this.sphere.position.y = 1;

    // simple rotation along the y axis
    this.scene.registerAfterRender(() => {
      this.sphere.rotate (
        new Vector3(0, 1, 0),
        0.02,
        Space.LOCAL
      );
    });

    // generates the world x-y-z axis for better understanding
    //this.showWorldAxis(8);
    this.sphere.actionManager = new ActionManager(this.scene);
    this.sphere.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
   
        this.ngZone.run(() => {
          this.router.navigate(['/boulette']); 
        });
      })
    );
  
    this.scene.registerBeforeRender(() => {
      this.moveAround();
  });
  }
  
  public moveAround(): void {
    this.time += 0.02;
    this.sphere.position.x = 5 * Math.cos(this.time); // Radius of 5 on the X-axis
    this.sphere.position.z = 2 * Math.sin(this.time); // Radius of 5 on the Z-axis
    this.sphere.position.y = 2 * Math.sin(this.time); // Radius of 5 on the Z-axis

  }


  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }


  public setCloudBackground(): void {
    const cloudPlane = Mesh.CreatePlane('cloudPlane', 100, this.scene);
    cloudPlane.position.z = 25; // Position the plane far away to act as a background
    cloudPlane.rotation.x = Math.PI / 2; // Align it with the background

    // Apply a cloud texture to the plane
    const cloudMaterial = new StandardMaterial('cloudMaterial', this.scene);
    const cloudTexture = new Texture('assets/textures/fantastic-cloudscape.jpg', this.scene);
    cloudMaterial.diffuseTexture = cloudTexture;
    cloudMaterial.backFaceCulling = false; // Make it visible from all angles
    cloudPlane.material = cloudMaterial;

    // Animate the cloud texture to simulate movement
    this.scene.registerBeforeRender(() => {
      if (cloudMaterial.diffuseTexture) {
       // cloudMaterial.diffuseTexture.uOffset += 0.001; // Horizontal scrolling
      }
    });
  }


  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
   /*
  public showWorldAxis(size: number): void {

    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this.scene,
      true
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
      ],
      this.scene,
      true
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
        new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
      ],
      this.scene,
      true
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }
  */
}
