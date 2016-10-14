var game = init();

function init() {
    var p = {
        logoHeight : 0.2,
        boxHeight  : 0.4,
        aimBoxSpeed: 5,
        isCollision: true,
        colors     : [
            {r: 237, g: 66, b: 87},
            {r: 239, g: 83, b: 102},
            {r: 240, g: 94, b: 112},
            {r: 242, g: 106, b: 124},
            {r: 244, g: 120, b: 136},
            {r: 245, g: 132, b: 146},
            {r: 246, g: 140, b: 154},
            {r: 247, g: 151, b: 151},
            {r: 255, g: 226, b: 169}
        ],
        isGameOver : false
    };

    var boxs = [];
    var model = {
        boxs: []
    };

    //region start
    var canvas = document.getElementById("application-canvas");
    var app = new pc.Application(canvas, {});
    app.start();

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    window.addEventListener('resize', function () {
        app.resizeCanvas(canvas.width, canvas.height);
    });
    //endregion

    //材质颜色
    function createMaterial(r, g, b) {
        var material = new pc.StandardMaterial();
        material.ambient.set(r, g, b);
        material.diffuse.set(r, g, b);
        material.specular.set(0.5, 0.5, 0.5);
        material.shininess = 50;
        material.update();
        return material;
    }

    //目标块
    function createAimBox() {
        this.dir = 'right';
        this.speed = 5;

        this.entity = new pc.Entity();
        this.entity.addComponent('model', {
            type: "box"
        });
        this.entity.setLocalScale(3 + p.logoHeight + p.logoHeight, p.boxHeight, 2 + p.logoHeight);

        this.entity.setPosition(0, boxs.length * p.boxHeight + 3, 0);

        app.root.addChild(this.entity);
        return this;
    }

    createAimBox.prototype.resetPos = function (dir) {
        this.dir = dir;
        var _offset = 3;
        if (this.dir == 'right') {
            this.entity.setPosition(_offset, boxs.length * p.boxHeight + 3, 0);
        } else {
            this.entity.setPosition(0, boxs.length * p.boxHeight + 3, _offset);
        }
    };
    createAimBox.prototype.update = function (dt) {

        this.entity.enabled = p.isCollision;

        var aimOldPosX = this.entity.getPosition().x;
        if (aimOldPosX > 3) {
            this.speed = this.speed * -1;
        }
        if (aimOldPosX < -3) {
            this.speed = this.speed * -1;
        }
        var aimPosX = aimOldPosX + this.speed * dt;
        this.entity.setPosition(aimPosX, boxs.length * p.boxHeight + 3, 0)
    };

    model.aimBox = new createAimBox();
    model.aimBox.resetPos('right');

    //region 积木块
    function Box(arg) {
        var entity = new pc.Entity();
        var _size = {
            x: ( 3 + p.logoHeight * 2),
            y: p.logoHeight * 2,
            z: (2 + p.logoHeight)
        };
        entity.addComponent('model', {
            type: "box"
        });
        if (arg.color) {
            entity.model.model.meshInstances[0].material = createMaterial(arg.color.r / 255, arg.color.g / 255, arg.color.b / 255);
        }

        entity.setLocalScale(_size.x, _size.y, _size.z);
        entity.addComponent('rigidbody', {
            type       : "dynamic",
            restitution: 0,
            mass       : 10
        });
        entity.addComponent('collision', {
            type       : "box",
            halfExtents: [_size.x / 2, _size.y / 2, _size.z / 2]
        });
        entity.rigidbody.teleport(arg.pos.x, arg.pos.y, 0, 0, 0);
        entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
        entity.rigidbody.angularVelocity = pc.Vec3.ZERO;

        entity.collision.on('collisionstart', function (result) {
            if (p.isCollision == false) {
                p.isCollision = true;
            }
        });

        app.root.addChild(entity);
        return entity;
    }


    window.addEventListener('click', function () {
        if (p.isCollision) {
            p.isCollision = false;
            boxs.push({
                index : boxs.length,
                entity: new Box({
                    pos  : {
                        x: model.aimBox.entity.getPosition().x,
                        y: model.aimBox.entity.getPosition().y
                    },
                    color: p.colors[boxs.length]
                })
            });
        }


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
            type       : "static",
            restitution: 0
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

        var material = p.material || createMaterial(100 / 255, 100 / 255, 112 / 255);
        ground.model.model.meshInstances[0].material = material;
        app.root.addChild(ground);
        this.entity = ground;
    }

    var ground = new Ground({
        scale_x: 5,
        scale_y: 5,
        scale_z: 4 - p.logoHeight,
        pos_x  : 0,
        pos_y  : 0 - 5 / 2 - p.logoHeight - p.logoHeight,
        pos_z  : 0
    });

    // 1 222
    // 3 4 5
    var logo1 = new Ground({
        scale_x : 1,
        scale_y : p.logoHeight,
        scale_z : 1,
        pos_x   : (1 + p.logoHeight) * -1,
        pos_y   : 0 - p.logoHeight,
        pos_z   : (1 + p.logoHeight) / 2 * -1,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo2 = new Ground({
        scale_x : 1 + 1 + p.logoHeight,
        scale_y : p.logoHeight,
        scale_z : 1,
        pos_x   : (1 + p.logoHeight) / 2,
        pos_y   : 0 - p.logoHeight,
        pos_z   : (1 + p.logoHeight) / 2 * -1,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo3 = new Ground({
        scale_x : 1,
        scale_y : p.logoHeight,
        scale_z : 1,
        pos_x   : (1 + p.logoHeight) * -1,
        pos_y   : 0 - p.logoHeight,
        pos_z   : (1 + p.logoHeight) / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo4 = new Ground({
        scale_x : 1,
        scale_y : p.logoHeight,
        scale_z : 1,
        pos_x   : 0,
        pos_y   : 0 - p.logoHeight,
        pos_z   : (1 + p.logoHeight) / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    var logo5 = new Ground({
        scale_x : 1,
        scale_y : p.logoHeight,
        scale_z : 1 + p.logoHeight,
        pos_x   : 1 + p.logoHeight,
        pos_y   : 0 - p.logoHeight,
        pos_z   : 1 / 2,
        material: createMaterial(231 / 255, 78 / 255, 80 / 255)
    });
    //endregion

    //region 摄像机
    function Camera() {
        var camera = new pc.Entity();
        camera.addComponent('camera', {
            clearColor: new pc.Color(46 / 255, 42 / 255, 56 / 255)
        });
        camera.setPosition(-6, 4, 6);
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
    var light = new Light();
    var light = new Light2();
    var light = new Light2();
    //endregion

    //背景

    //验证游戏失败
    checkGameOverFn();
    function checkGameOverFn() {
        var interval = setInterval(function () {
            for (var i = 0; i < boxs.length; i++) {
                var y = boxs[i].entity.getPosition().y;
                if (y < (boxs[i].index * p.boxHeight)) {
                    clearInterval(interval)
                    GameOverFn();
                    console.log('gameover')
                }
            }
        }, 300);
    }

    //游戏结束
    function GameOverFn() {
        // app.isPaused=true;
        for (var i = 0; i < boxs.length; i++) {
            // boxs[i].animation.speed = 0;
            boxs[i].entity.rigidbody.type = 'static';
        }
        p.isGameOver = true;

        model.aimBox.enabled = false;

        getScoreFn();
    }

    //获取得分
    function getScoreFn() {
        console.log("得分：" + boxs.length)
    }


    //刷新
    var aimBoxSpeed = 5;
    app.on('update', function (dt) {
        if (p.isGameOver) {
            if (camera.getPosition().z < (6 * 5)) {
                camera.setPosition(camera.getPosition().x - 3 * dt, camera.getPosition().y, camera.getPosition().z + 3 * dt);
            }
        } else {
            if (camera.getPosition().y < (4 + (p.boxHeight * boxs.length))) {
                camera.setPosition(camera.getPosition().x, camera.getPosition().y + 0.5 * dt, camera.getPosition().z);
            }

            model.aimBox.update(dt);
        }
    });

    return p;
}
