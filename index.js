function Game() {
    var p = {
        logoHeight : 0.2,
        boxHeight  : 0.5,
        isCollision: true,
        colors     : [
            [0.90, 0.26, 0.37],
            [0.92, 0.29, 0.36],
            [0.93, 0.32, 0.38],
            [0.95, 0.36, 0.40],
            [0.96, 0.42, 0.44],

            [0.97, 0.51, 0.51],
            [0.97, 0.56, 0.55],
            [0.98, 0.60, 0.58],
            [0.98, 0.64, 0.61],
            [0.98, 0.67, 0.64],

            [0.98, 0.70, 0.66],
            [0.99, 0.73, 0.69],
            [0.99, 0.76, 0.71],
            [0.99, 0.78, 0.73],
            [1.00, 0.88, 0.75],

            [1.00, 0.84, 0.75],
            [1.00, 0.81, 0.74],
            [0.99, 0.79, 0.73],
            [0.99, 0.76, 0.71],
            [0.99, 0.74, 0.69],

            [0.98, 0.69, 0.66],
            [0.98, 0.67, 0.64],
            [0.98, 0.63, 0.61],
            [0.98, 0.60, 0.58],
            [0.97, 0.56, 0.55],

            [0.96, 0.50, 0.49],
            [0.96, 0.44, 0.45],
            [0.95, 0.38, 0.41],
            [0.94, 0.33, 0.38],
            [0.92, 0.28, 0.36],

            [0.90, 0.26, 0.37],
            [0.89, 0.25, 0.38],
            [0.87, 0.24, 0.41],
            [0.85, 0.24, 0.43],
            [0.83, 0.24, 0.46],

            [0.80, 0.25, 0.50],
            [0.78, 0.25, 0.54],
            [0.76, 0.25, 0.57],
            [0.74, 0.25, 0.62],
            [0.72, 0.25, 0.65],

            [0.69, 0.25, 0.69],
            [0.66, 0.25, 0.72],
            [0.64, 0.25, 0.75],
            [0.61, 0.26, 0.76],
            [0.56, 0.27, 0.79],

            [0.51, 0.27, 0.81],
            [0.47, 0.28, 0.83],
            [0.44, 0.29, 0.84],
            [0.41, 0.29, 0.84],
            [0.38, 0.31, 0.85],

            [0.35, 0.33, 0.85],
            [0.32, 0.35, 0.85],
            [0.30, 0.37, 0.85],
            [0.27, 0.40, 0.84],
            [0.25, 0.42, 0.84]

        ],
        isGameOver : false
    };
    this.p = p;

    var model = {
        boxs: []
    };
    this.model = model;

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

    function getColor() {
        return p.colors[model.boxs.length % p.colors.length];
    }

    //region 目标块
    function AimBox() {
        this.dir = 'right';
        this.speed = 5;

        this.entity = new pc.Entity();
        this.entity.addComponent('model', {
            type: "box"
        });
        this.entity.setLocalScale(3 + p.logoHeight + p.logoHeight, p.boxHeight, 2 + p.logoHeight);
        this.entity.setPosition(0, model.boxs.length * p.boxHeight + 3, 0);
        var _color = getColor();
        this.entity.model.model.meshInstances[0].material = createMaterial(_color[0], _color[1], _color[2]);
        app.root.addChild(this.entity);
    }
    AimBox.prototype.reset = function () {
        var _color = getColor();
        this.entity.model.model.meshInstances[0].material = createMaterial(_color[0], _color[1], _color[2]);
        this.resetPos();
    };
    AimBox.prototype.resetMaterial = function () {
        var _color = getColor();
        this.entity.model.model.meshInstances[0].material = createMaterial(_color[0], _color[1], _color[2]);
    };
    AimBox.prototype.resetPos = function (dir) {
        this.entity.enabled = true;
        this.dir = dir;
        var _offset = 3;
        if (this.dir == 'right') {
            this.entity.setPosition(_offset, model.boxs.length * p.boxHeight + 3, 0);
        } else {
            this.entity.setPosition(0, model.boxs.length * p.boxHeight + 3, _offset * -1);
        }
    };
    AimBox.prototype.update = function (dt) {

        if (this.dir == 'right') {
            var aimOldPosX = this.entity.getPosition().x;
            if (aimOldPosX > 3) {
                this.speed = Math.abs(this.speed) * -1;
            } else if (aimOldPosX < -3) {
                this.speed = Math.abs(this.speed);
            }
            var aimPosX = aimOldPosX + this.speed * dt;
            this.entity.setPosition(aimPosX, model.boxs.length * p.boxHeight + 3, 0)
        } else {
            var aimOldPosZ = this.entity.getPosition().z;
            if (aimOldPosZ > 3) {
                this.speed = Math.abs(this.speed) * -1;
            } else if (aimOldPosZ < -3) {
                this.speed = Math.abs(this.speed);
            }
            var aimPosZ = aimOldPosZ + this.speed * dt;
            this.entity.setPosition(0, model.boxs.length * p.boxHeight + 3, aimPosZ)
        }


    };

    model.AimBox = new AimBox();
    model.AimBox.resetPos('right');

    //endregion

    //region 积木块
    function Box(arg) {
        var entity = new pc.Entity();
        var _size = {
            x: ( 3 + p.logoHeight * 2),
            y: p.boxHeight,
            z: (2 + p.logoHeight)
        };
        entity.addComponent('model', {
            type: "box"
        });
        if (arg.color) {
            entity.model.model.meshInstances[0].material = createMaterial(arg.color[0], arg.color[1], arg.color[2]);
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
        entity.rigidbody.teleport(arg.pos.x, arg.pos.y, arg.pos.z, 0, 0);
        entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
        entity.rigidbody.angularVelocity = pc.Vec3.ZERO;

        entity.collision.on('collisionstart', function (result) {
            if (p.isCollision == false) {
                p.isCollision = true;
                boxCollisionCallback();
            }
        });

        app.root.addChild(entity);
        return entity;
    }

    function boxCollisionCallback() {

        if (model.AimBox.dir == 'right') {
            model.AimBox.resetPos('left');
        } else {
            model.AimBox.resetPos('right');
        }
    }


    window.addEventListener('touchstart', function () {
        if (p.isCollision) {
            p.isCollision = false;
            if (model.AimBox.entity.enabled == true) {
                model.AimBox.entity.enabled = false;
                model.boxs.push({
                    index : model.boxs.length,
                    entity: new Box({
                        pos  : {
                            x: model.AimBox.entity.getPosition().x,
                            y: model.AimBox.entity.getPosition().y,
                            z: model.AimBox.entity.getPosition().z
                        },
                        color: getColor()
                    })
                });
                model.AimBox.resetMaterial();
            }
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
        this.entity = new pc.Entity();
        this.entity.addComponent('camera', {
            clearColor: new pc.Color(46 / 255, 42 / 255, 56 / 255)
        });
        this.entity.setPosition(-6, 4, 6);
        this.entity.lookAt(0, 1, 0);
        app.root.addChild(this.entity);

    }

    Camera.prototype.reset = function (dt) {
        this.entity.setPosition(-6, 4, 6);
        this.entity.lookAt(0, 1, 0);
    };

    Camera.prototype.update = function (dt) {
        var camera = this.entity;
        if (camera.getPosition().y < (4 + (p.boxHeight * model.boxs.length))) {
            camera.setPosition(camera.getPosition().x, camera.getPosition().y + 0.5 * dt, camera.getPosition().z);
        }
    };
    Camera.prototype.gameOverZoom = function (dt, callback) {
        var camera = this.entity;
        if (camera.getPosition().z < 10) {
            camera.setPosition(camera.getPosition().x - 3 * dt, camera.getPosition().y + 3 * dt, camera.getPosition().z + 3 * dt);
        } else {
            callback && callback();
        }
    };
    model.camera = new Camera();
    //endregion

    //region 灯光
    function Light() {
        var light = new pc.Entity();
        light.addComponent('light', {
            color: new pc.Color(1, 1, 1)
        });
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
    var light = new Light2();
    //endregion

    //验证游戏失败
    this.checkGameOver();

    //刷新
    app.on('update', function (dt) {
        if (p.isGameOver) {
            model.camera.gameOverZoom(dt);
        } else {
            model.camera.update(dt);
            model.AimBox.update(dt);
        }
    });

}
Game.prototype.checkGameOver = function () {
    var model = this.model;
    var p = this.p;
    var interval = setInterval(function () {
        for (var i = 0; i < model.boxs.length; i++) {
            var y = model.boxs[i].entity.getPosition().y;
            if (y < (model.boxs[i].index * p.boxHeight - 1)) {
                clearInterval(interval);

                GameOverFn();
                function GameOverFn() {
                    //固定堆叠位置
                    for (var i = 0; i < model.boxs.length; i++) {
                        model.boxs[i].entity.rigidbody.type = 'static';
                    }
                    p.isGameOver = true;
                    model.AimBox.entity.enabled = false;

                    //得分画面
                    $('.score-area').show();
                    $('.score-number').html(model.boxs.length)

                    console.log('gameover')
                }

            }
        }
    }, 300);
};
Game.prototype.restart = function () {
    //清除已经堆叠的
    var boxs = this.model.boxs;
    for (var i = 0; i < boxs.length; i++) {
        boxs[i].entity.destroy();
    }
    boxs.length = 0;

    //
    var AimBox = this.model.AimBox;
    AimBox.reset();

    //镜头
    var camera = this.model.camera;
    camera.reset();

    //重置状态
    this.p.isGameOver = false;
    this.p.isCollision = true;

    //清除计分牌
    $('.score-area').hide();

    this.checkGameOver();

};

$(function () {
    var game = new Game();

    $('.restart-btn').click(function () {
        game.restart();
    })
});