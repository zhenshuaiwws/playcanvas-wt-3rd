init();
function init() {

    var logoSpace = 0.2;


    var canvas = document.getElementById("application-canvas");
    var app = new pc.Application(canvas, {});
    app.start();

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    window.addEventListener('resize', function () {
        app.resizeCanvas(canvas.width, canvas.height);
    });

    function createMaterial(r, g, b) {
        var material = new pc.StandardMaterial();
        material.ambient.set(r, g, b);
        material.diffuse.set(r, g, b);
        material.specular.set(0.5, 0.5, 0.5);
        material.shininess = 50;
        material.update();
        return material;
    }

    //活动块
    function AimBox(x, y) {
        this.dir = true;

        this.entity = new pc.Entity();
        this.entity.addComponent('model', {
            type: "box"
        });
        this.entity.setLocalScale(3 + logoSpace + logoSpace, 1, 2 + logoSpace);

        app.root.addChild(this.entity);
        return this.entity;
    }

    AimBox.prototype.reset = function () {
        this.dir = !this.dir;
        if (this.dir) {
            this.entiry.setPosition(6, boxs.length + 1, 0);
        } else {
            this.entiry.setPosition(0, boxs.length + 1, 6);
        }
    };

    var aimBox = new AimBox();


    //region 积木块
    function Box(x, y) {
        var cube = new pc.Entity();
        cube.addComponent('model', {
            type: "box"
        });
        cube.setLocalScale(3, 1, 2);
        cube.addComponent('rigidbody', {
            type: "dynamic"
        });
        cube.addComponent('collision', {
            type       : "box",
            halfExtents: [1.5, 0.5, 1]
        });
        cube.rigidbody.teleport(x || 0, y || 15, 0, 0, 0);
        cube.rigidbody.linearVelocity = pc.Vec3.ZERO;
        cube.rigidbody.angularVelocity = pc.Vec3.ZERO;

        app.root.addChild(cube);
        return cube;
    }

    var boxs = [];

    window.addEventListener('click', function () {
        boxs.push({
            index : boxs.length + 1,
            entity: new Box(aimBox.getPosition().x, boxs.length)
        });


    });

    //endregion

    //region 底座
    function Ground(p) {
        var ground = new pc.Entity();
        ground.setPosition(p.pos_x || 0, p.pos_y || 0, p.pos_z || 0);
        ground.setLocalScale(p.scale_x, p.scale_y || 1, p.scale_z);
        ground.addComponent('model', {
            type: "box"
        });
        ground.addComponent('rigidbody', {
            type: "static"
        });
        ground.addComponent('collision', {
            type       : "box",
            halfExtents: [p.scale_x / 2, p.scale_y / 2, p.scale_z / 2]
        });
        // ground.addComponent('light', {
        //     type: "point",
        //     color: new pc.Color(1, 0, 0),
        //     range: 2
        // });

        var material = p.material || createMaterial(1, 1, 1);
        ground.model.model.meshInstances[0].material = material;
        app.root.addChild(ground);
        this.entity = ground;
    }

    var ground = new Ground({
        scale_x: 5,
        scale_y: 5,
        scale_z: 4 - logoSpace,
        pos_x  : 0,
        pos_y  : -4 / 2 - logoSpace,
        pos_z  : 0
    });

    // 1 222
    // 3 4 5
    var logo1 = new Ground({
        scale_x : 1,
        scale_y : logoSpace,
        scale_z : 1,
        pos_x   : (1 + logoSpace) * -1,
        pos_y   : (1 + logoSpace) / 2 - logoSpace,
        pos_z   : (1 + logoSpace) / 2 * -1,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo2 = new Ground({
        scale_x : 1 + 1 + logoSpace,
        scale_y : logoSpace,
        scale_z : 1,
        pos_x   : (1 + logoSpace) / 2,
        pos_y   : (1 + logoSpace) / 2 - logoSpace,
        pos_z   : (1 + logoSpace) / 2 * -1,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo3 = new Ground({
        scale_x : 1,
        scale_y : logoSpace,
        scale_z : 1,
        pos_x   : (1 + logoSpace) * -1,
        pos_y   : (1 + logoSpace) / 2 - logoSpace,
        pos_z   : (1 + logoSpace) / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo4 = new Ground({
        scale_x : 1,
        scale_y : logoSpace,
        scale_z : 1,
        pos_x   : 0,
        pos_y   : (1 + logoSpace) / 2 - logoSpace,
        pos_z   : (1 + logoSpace) / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo5 = new Ground({
        scale_x : 1,
        scale_y : logoSpace,
        scale_z : 1 + logoSpace,
        pos_x   : 1 + logoSpace,
        pos_y   : (1 + logoSpace) / 2 - logoSpace,
        pos_z   : 1 / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    //endregion

    //region 摄像机
    function Camera() {
        var camera = new pc.Entity();
        camera.addComponent('camera', {
            clearColor: new pc.Color(228 / 255, 222 / 255, 222 / 255)
        });
        camera.setPosition(-6, 4, 5);
        camera.lookAt(0, 1, 0);
        app.root.addChild(camera);

        return camera;
    }

    var camera = new Camera();
    //endregion

    //region 灯光
    function Light() {
        var light = new pc.Entity();
        light.addComponent('light');
        light.setEulerAngles(45, 0, 30);
        app.root.addChild(light);

    }
    function Light2() {
        var light = new pc.Entity();
        light.addComponent('light');
        light.setEulerAngles(0, 0, 0);
        app.root.addChild(light);

    }

    var light = new Light();
    var light = new Light2();
    //endregion

    //背景

    //验证游戏失败
    checkGameOverFn();
    function checkGameOverFn() {
        var interval = setInterval(function () {
            for (var i = 0; i < boxs.length; i++) {
                var y = Math.round(boxs[i].entity.getPosition().y);
                if (y < (boxs[i].index - 0.7)) {
                    clearInterval(interval)
                    console.log('gameover')
                    GameOverFn();
                }
            }
        }, 300);
    }

    //游戏结束
    function GameOverFn() {
        getScoreFn()
    }

    //获取得分
    function getScoreFn() {
        alert(boxs.length)
    }

    function zoomCamera() {

    }


    //刷新
    var aimBoxPosDir = 5;
    app.on('update', function (dt) {
        //camera
        // if (camera.getPosition().y < (boxs.length + 10)) {
        //     camera.setPosition(5, camera.getPosition().y + 0.5 * dt, 15);
        // }

        //aim
        var aimOldPosX = aimBox.getPosition().x;
        if (aimOldPosX > 9) {
            aimBoxPosDir = aimBoxPosDir * -1;
        }
        if (aimOldPosX < -9) {
            aimBoxPosDir = aimBoxPosDir * -1;
        }
        var aimPosX = aimOldPosX + aimBoxPosDir * dt;
        aimBox.setPosition(aimPosX, boxs.length + 2 - logoSpace, 0)
    });

}
