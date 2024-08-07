/**
 * Author: Shadow Themes
 * Author URL: https://shadow-themes.com
 */
"use strict";

class Anita_GL_Roll {
    constructor(b, c = !1) {
        if (b instanceof jQuery ? this.$el = b : this.$el = jQuery(b), !this.$el.length) return console.warn("gl_Gallery: Element not found"), !1;
        if (!this.$el.children("div").length) return console.warn("gl_Gallery: There are no slides"), !1;
        if (this.options = {
            container: jQuery("body"),
            size: .5,
            antialised: !0,
            spacing: 40,
            camera_move: [.5, .3],
            responsive: !1,
            cameraRotateSpeed: .025,
            cameraMoveSpeed: .02,
            wheelSensitive: 50,
            nav: !0
        }, c) for (let [d, e] of Object.entries(c)) this.options[d] = e;
        let a = this;
        this.loader = new THREE.TextureLoader, this.clock = new THREE.Clock, this.prevTime = 0, this.$el.css("transform", "translateY(0px)"), this.shv = 3.8366, this.spacing = this.options.spacing * (2 * this.shv / window.innerHeight), this.position = {
            gallery_t: 0,
            gallery_c: 0,
            camera_tR: {x: 0, y: 0, z: -0.05},
            camera_cR: {x: 0, y: 0, z: -0.05},
            camera_cM: {x: 0, y: 0, z: 5},
            camera_tM: {x: 0, y: 0, z: 5},
            camera_old: {},
            text_c: 0,
            text_t: 0,
            curve_c: 1,
            curve_t: 1
        }, this.dimension = {slideWidth: 0}, this.cameraFixed = !1, this.isPortrait = !(window.innerWidth > window.innerHeight), this.view_pos = {
            def: 0,
            zoom: 0,
            menu: 0
        }, this.camera_distance = {
            land_n: 5,
            land_z: 3,
            land_m: 4,
            port_n: 8.5,
            port_z: 6.5,
            port_m: 7.5
        }, this.isPortrait ? this.view_pos = {
            def: this.camera_distance.port_n,
            zoom: this.camera_distance.port_z,
            menu: this.camera_distance.port_m
        } : this.view_pos = {
            def: this.camera_distance.land_n,
            zoom: this.camera_distance.land_z,
            menu: this.camera_distance.land_m
        }, this.scene = new THREE.Scene, this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .5, 1e3), this.camera.position.z = this.view_pos.def, this.camera.position.y = 0, this.camera.rotation.z = -0.05, this.camera.rotation.x = -0.2314, this.renderer = new THREE.WebGLRenderer({
            antialias: a.options.antialised,
            alpha: !1
        }), this.renderer.setSize(window.innerWidth, window.innerHeight), this.options.container[0].append(this.renderer.domElement), jQuery(this.renderer.domElement).addClass("anita-gl-roll-canvas"), Anita_isWebGL2Available() ? this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {samples: 4}) : this.this.renderTarget = null, this.composer = new THREE.EffectComposer(this.renderer, this.renderTarget), this.composer.addPass(new THREE.RenderPass(this.scene, this.camera)), this.RollShader = {
            uniforms: {
                tDiffuse: {value: null},
                progress: {value: 1}
            },
            vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
            fragmentShader: `uniform sampler2D tDiffuse;uniform float progress;varying vec2 vUv;vec2 distort(vec2 oUV) {float d=progress*0.28;float f=progress*-0.56;vec2 uvC=oUV-0.5;float r2=uvC.x*uvC.x+uvC.y*uvC.y;float ds=0.0;if(d==0.0){ds = 1.0;}else{ds=1.0+r2*(f+d*sqrt(r2));}return vec2(ds * uvC.x + 0.5, ds * uvC.y + 0.5);}void main(){vec4 c = texture2D(tDiffuse,distort(vUv));gl_FragColor = c;}`
        }, this.rollPass = new THREE.ShaderPass(this.RollShader), this.composer.addPass(this.rollPass);
        let f = 0;
        this.aGallery = Array(), this.gallery = new THREE.Group, this.ghosts_lt = new THREE.Group, this.ghosts_rt = new THREE.Group, this.$el.children("div").each(function (l) {
            let d = jQuery(this), c = d.attr("data-size").split("x"),
                m = parseFloat(parseInt(c[0], 10) / parseInt(c[1], 10)).toFixed(3), b = a.getImageSize(m), e;
            if (d.hasClass("is-video")) {
                let j = jQuery('<video src="' + d.attr("data-src") + '" webkit-playsinline="true" playsinline="true" muted autoplay loop/>');
                d.append(j), e = new THREE.VideoTexture(j[0])
            } else e = a.loader.load(d.attr("data-src"));
            let n = new THREE.ShaderMaterial({
                    uniforms: {
                        time: {value: 1},
                        tDiffuse: {value: e},
                        resolution: {value: new THREE.Vector2(c[0], c[1])},
                        fadeLevel: {value: .5}
                    },
                    vertexShader: `varying vec2 v_texCoord;void main(){v_texCoord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
                    fragmentShader: `uniform vec2 resolution;uniform sampler2D tDiffuse;uniform float fadeLevel;varying vec2 v_texCoord;void main(){gl_FragColor=vec4(mix(texture2D(tDiffuse,v_texCoord).rgb,vec3(0.0,0.0,0.0),1.0-fadeLevel),1.0);}`
                }), k = new THREE.ShaderMaterial({
                    uniforms: {
                        time: {value: 1},
                        tDiffuse: {value: e},
                        resolution: {value: new THREE.Vector2(c[0], c[1])},
                        fadeLevel: {value: .25}
                    },
                    vertexShader: `varying vec2 v_texCoord;void main(){v_texCoord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
                    fragmentShader: `uniform vec2 resolution;uniform sampler2D tDiffuse;uniform float fadeLevel;varying vec2 v_texCoord;void main(){vec4 c = vec4( mix( texture2D(tDiffuse, v_texCoord).rgb, vec3(0.0, 0.0, 0.0), 1.0 - fadeLevel), 1.0);float g = float( 0.3 * c.r + 0.59 * c.g + 0.11 * c.b );c.r = c.g = c.b = g;gl_FragColor = c;}`
                }), g = new THREE.Mesh(new THREE.PlaneGeometry(b[0], b[1]), n),
                h = new THREE.Mesh(new THREE.PlaneGeometry(b[0], b[1]), k),
                i = new THREE.Mesh(new THREE.PlaneGeometry(b[0], b[1]), k);
            0 === f ? f += .125 * parseFloat(b[1]).toFixed(3) : f -= .5 * parseFloat(b[1]), g.position.y = f, h.position.y = f, i.position.y = f, g.position.x = 0, h.position.x = 0 - parseFloat(b[0]).toFixed(3) - parseFloat(a.spacing), i.position.x = 1 * parseFloat(b[0]).toFixed(3) + parseFloat(a.spacing), a.gallery.add(g), a.ghosts_lt.add(h), a.ghosts_rt.add(i), a.aGallery[l] = f, f -= .5 * parseFloat(b[1]) + parseFloat(a.spacing), g.height = parseFloat(b[1]) + parseFloat(a.spacing)
        }), this.scene.add(this.gallery), this.scene.add(this.ghosts_lt), this.scene.add(this.ghosts_rt), this.active = 0, this.max = this.gallery.children.length - 1, this.$el.children("div").eq(this.active).addClass("is-active"), this.options.nav && (this.ui = {
            prev: jQuery('<a href="javascript:void(0)" class="anita-gallery-nav anita-gallery-nav__prev">' + (a.$el.attr("data-prev-label") ? "<span>" + a.$el.attr("data-prev-label") + "</span>" : "") + "</a>"),
            next: jQuery('<a href="javascript:void(0)" class="anita-gallery-nav anita-gallery-nav__next">' + (a.$el.attr("data-next-label") ? "<span>" + a.$el.attr("data-next-label") + "</span>" : "") + "</a>")
        }, this.$el.after(this.ui.prev).after(this.ui.next), this.ui.prev.on("click", function () {
            a.prevSlide()
        }), this.ui.next.on("click", function () {
            a.nextSlide()
        })), this.moveEvent = {
            active: !1, current: 0, point: 0, path: 0, moved: !1, f_Start: function (b) {
                jQuery(b.target).is("a.anita-gallery-nav") ? a.moveEvent.active = !1 : (a.moveEvent.active = !0, a.moveEvent.current = a.active, b.touches ? a.moveEvent.point = b.touches[0].clientY : (a.moveEvent.point = b.clientY, a.$el.parent().addClass("is-grabbed")))
            }, f_Move: function (c) {
                if (c.preventDefault(), a.moveEvent.active) {
                    c.touches ? a.moveEvent.path = 2 * (a.moveEvent.point - c.touches[0].clientY) : a.moveEvent.path = 2 * (a.moveEvent.point - c.clientY);
                    let e = a.moveEvent.path * a.p2p, b = -1 * (a.gallery.position.y + e),
                        d = .5 * a.gallery.children[a.active].height;
                    if (a.moveEvent.path > 0 && b <= a.aGallery[a.moveEvent.current + 1] + d && (a.moveEvent.current += 1, a.active = a.moveEvent.current), a.moveEvent.path < 0 && b >= a.aGallery[a.moveEvent.current - 1] - d && (a.moveEvent.current -= 1, a.active = a.moveEvent.current), a.position.text_c -= a.moveEvent.path, b > a.aGallery[0] || b < a.aGallery[a.max]) {
                        if (b > a.aGallery[0] && a.moveEvent.path < 0) {
                            let f = (b - a.aGallery[0]) / (.25 * window.innerHeight * a.p2p);
                            b += a.moveEvent.path * a.p2p * f, a.position.text_c += a.moveEvent.path
                        }
                        if (b < a.aGallery[a.max] && a.moveEvent.path > 0) {
                            let g = (a.aGallery[a.max] - b) / (.25 * window.innerHeight * a.p2p);
                            b += a.moveEvent.path * a.p2p * g, a.position.text_c += a.moveEvent.path
                        }
                    }
                    a.$el.css("transform", "translateY(" + a.position.text_c + "px)"), a.ghosts_lt.position.y = -1 * b, a.gallery.position.y = -1 * b, a.ghosts_rt.position.y = -1 * b, c.touches ? a.moveEvent.point = c.touches[0].clientY : a.moveEvent.point = c.clientY
                }
            }, f_End: function () {
                a.changeSlide(), a.moveEvent.active = !1, a.moveEvent.point = 0, a.moveEvent.path = 0, a.$el.parent().removeClass("is-grabbed")
            }
        }, jQuery(window).on("resize", function () {
            a.layout()
        }), this.wheelTime = 0, this.isTouch = !1, this.$el.parent()[0].addEventListener("wheel", function (b) {
            b.timeStamp - a.wheelTime > a.options.wheelSensitive ? (b.deltaY > 0 && a.nextSlide(), b.deltaY < 0 && a.prevSlide()) : b.preventDefault(), a.wheelTime = b.timeStamp
        }), jQuery(document).on("mousemove", function (b) {
            if (!a.isTouch && !a.cameraFixed) {
                let c = parseFloat(b.pageX - .5 * window.innerWidth) / (.5 * window.innerWidth).toFixed(3),
                    d = parseFloat(b.pageY - .5 * window.innerHeight) / (.5 * window.innerHeight).toFixed(3);
                a.position.camera_tM.x = a.options.camera_move[0] * c, a.position.camera_tM.x > a.options.camera_move[0] && (a.position.camera_tM.x = a.options.camera_move[0]), a.position.camera_tM.x < -1 * a.options.camera_move[0] && (a.position.camera_tM.x = -1 * a.options.camera_move[0]), a.position.camera_tM.y = -1 * (a.options.camera_move[1] * d), a.position.camera_tM.y > a.options.camera_move[1] && (a.position.camera_tM.y = a.options.camera_move[1]), a.position.camera_tM.y < -1 * a.options.camera_move[1] && (a.position.camera_tM.y = -1 * a.options.camera_move[1])
            }
        }).on("mouseleave", function () {
            a.position.camera_tM.x = 0, a.position.camera_tM.y = 0
        }), this.$el.parent().on("mousedown", function (b) {
            a.isTouch || a.moveEvent.f_Start(b)
        }), this.$el.parent().on("mousemove", function (b) {
            a.isTouch || a.moveEvent.f_Move(b)
        }), this.$el.parent().on("mouseup", function (b) {
            a.moveEvent.f_End()
        }), this.$el.parent().on("mouseleave", function (b) {
            a.moveEvent.f_End()
        }), this.$el.parent().on("touchstart", function (b) {
            a.isTouch = !0, a.moveEvent.f_Start(b)
        }), this.$el.parent().on("touchmove", function (b) {
            a.moveEvent.f_Move(b)
        }), this.$el.parent().on("touchend", function () {
            a.moveEvent.f_End()
        }), jQuery(document).on("keyup", function (b) {
            37 == b.keyCode && a.prevSlide(), 39 == b.keyCode && a.nextSlide(), 38 == b.keyCode && a.prevSlide(), 40 == b.keyCode && a.nextSlide(), 32 == b.keyCode && (a.cameraFixed ? (a.cameraFixed = !1, a.position.curve_t = 1) : (a.cameraFixed = !0, a.position.curve_t = 0))
        }), this.$el.on("mouseenter", "a", function () {
            a.cameraFixed = !0, a.position.curve_t = 0
        }).on("mouseleave", "a", function () {
            a.cameraFixed = !1, a.position.curve_t = 1
        }), this.$el.on("click", ".anita-album-link", function () {
            window.localStorage.setItem("anita_listing_index", a.active)
        }), this.$el.parent().hasClass("anita-albums-listing") && null !== window.localStorage.getItem("anita_back_from_album") && null !== window.localStorage.getItem("anita_listing_index") && (!0 == JSON.parse(window.localStorage.getItem("anita_back_from_album")) && (this.active = parseInt(JSON.parse(window.localStorage.getItem("anita_listing_index")), 10), this.position.gallery_t = -1 * this.gallery.children[this.active].position.y, this.gallery.position.y = this.ghosts_lt.position.y = this.ghosts_rt.position.y = this.position.gallery_t, this.position.text_t = this.position.text_c = -0.5 * this.active * window.innerHeight, this.$el.css("transform", "translateY(" + this.position.text_c + "px)")), window.localStorage.setItem("anita_back_from_album", !1), window.localStorage.setItem("anita_listing_index", "0")), this.changeSlide(), a.layout(), this.$el.parent().addClass("is-loaded"), setTimeout(function () {
            jQuery(a.renderer.domElement).addClass("is-loaded")
        }, 100, a), this.anim = requestAnimationFrame(() => this.animate())
    }

    prevSlide() {
        this.active -= 1, this.active < 0 && (this.active = 0), this.changeSlide()
    }

    nextSlide() {
        this.active += 1, this.active > this.max && (this.active = this.max), this.changeSlide()
    }

    changeSlide() {
        this.$el.children(".is-active").children("video").length && this.$el.children(".is-active").children("video")[0].pause(), this.$el.children(".is-active").removeClass("is-active"), this.$el.children("div").eq(this.active).addClass("is-active"), this.$el.children(".is-active").children("video").length && this.$el.children(".is-active").children("video")[0].play(), this.options.nav && (0 == this.active ? this.ui.prev.addClass("is-disabled") : this.ui.prev.removeClass("is-disabled"), this.active == this.max ? this.ui.next.addClass("is-disabled") : this.ui.next.removeClass("is-disabled")), this.position.text_t = -1 * this.active * this.$el.children().eq(this.active).height(), this.position.gallery_t = -1 * this.gallery.children[this.active].position.y
    }

    layout() {
        let a = window.innerWidth, b = window.innerHeight;
        this.isPortrait = !(a > b), this.isPortrait ? this.view_pos = {
            def: this.camera_distance.port_n,
            zoom: this.camera_distance.port_z,
            menu: this.camera_distance.port_m
        } : this.view_pos = {
            def: this.camera_distance.land_n,
            zoom: this.camera_distance.land_z,
            menu: this.camera_distance.land_m
        }, this.renderer.setSize(a, b), this.camera.aspect = a / b, this.camera.updateProjectionMatrix(), this.p2p = 2 * this.shv / window.innerHeight, this.spacing = this.options.spacing * (2 * this.shv / window.innerHeight), this.dimension.slideWidth = this.$el.children().width(), this.changeSlide()
    }

    getImageSize(a = 1) {
        a = parseFloat(a).toFixed(3);
        let b = parseFloat(2 * this.shv * this.options.size).toFixed(3);
        return [parseFloat(b * a).toFixed(3), b]
    }

    animate() {
        "undefined" != typeof stats && stats.begin();
        let b = this;
        this.anim = requestAnimationFrame(() => this.animate());
        let c = this.clock.getElapsedTime(), a = c - this.prevTime;
        this.prevTime = c, b.moveEvent.active || (this.gallery.position.y += (this.position.gallery_t - this.gallery.position.y) * 2 * a, this.ghosts_lt.position.y += (this.position.gallery_t - this.ghosts_lt.position.y) * 2 * a, this.ghosts_rt.position.y += (this.position.gallery_t - this.ghosts_rt.position.y) * 2 * a), this.cameraFixed ? (this.camera.rotation.x += (.07 - this.camera.rotation.x) * 2 * a, this.camera.rotation.z += (0 - this.camera.rotation.z) * 2 * a) : (this.camera.rotation.x += (0 - this.camera.rotation.x) * a, this.camera.rotation.z += (this.position.camera_tR.z - this.camera.rotation.z) * a, this.camera.rotation.x > .07 ? this.camera.rotation.x = .07 : this.camera.rotation.x < -0.3 && (this.camera.rotation.x = -0.3), this.camera.rotation.z > .05 ? this.camera.rotation.z = .05 : this.camera.rotation.z < -0.05 && (this.camera.rotation.z = -0.05)), this.cameraFixed ? (this.camera.position.x += (0 - this.camera.position.x) * 2 * a, this.camera.position.y += (-0.3 - this.camera.position.y) * 2 * a, this.camera.position.z += (this.view_pos.zoom - this.camera.position.z) * 2 * a) : jQuery("body").hasClass("anita-show-menu") ? (this.camera.position.x += (this.position.camera_tM.x - this.camera.position.x) * a, this.camera.position.y += (this.position.camera_tM.y - this.camera.position.y) * a, this.camera.position.z += (this.view_pos.menu - this.camera.position.z) * a * 2) : (this.camera.position.x += (this.position.camera_tM.x - this.camera.position.x) * a, this.camera.position.y += (this.position.camera_tM.y - this.camera.position.y) * a, this.camera.position.z += (this.view_pos.def - this.camera.position.z) * a), this.camera.position.x > this.options.camera_move[0] ? this.camera.position.x = this.options.camera_move[0] : this.camera.position.x < -1 * this.options.camera_move[0] && (this.camera.position.x = -1 * this.options.camera_move[0]), this.camera.position.y > this.options.camera_move[1] ? this.camera.position.y = this.options.camera_move[1] : this.camera.position.y < -1 * this.options.camera_move[1] && (this.camera.position.y = -1 * this.options.camera_move[1]), this.rollPass.uniforms.progress.value += (this.position.curve_t - this.rollPass.uniforms.progress.value) * 2 * a, this.rollPass.uniforms.progress.value > 1 ? this.rollPass.uniforms.progress.value = 1 : this.rollPass.uniforms.progress.value < 0 && (this.rollPass.uniforms.progress.value = 0);
        let d = 0;
        jQuery(this.gallery.children).each(function () {
            d !== b.active && this.material.uniforms.fadeLevel.value > .3 && (this.material.uniforms.fadeLevel.value -= (this.material.uniforms.fadeLevel.value - .3) * .05), d++
        }), this.gallery.children[this.active].material.uniforms.fadeLevel.value < 1 && (this.gallery.children[this.active].material.uniforms.fadeLevel.value += (1 - this.gallery.children[this.active].material.uniforms.fadeLevel.value) * .05), b.moveEvent.active || (this.position.text_c += (this.position.text_t - this.position.text_c) * 2 * a, this.$el.css("transform", "translateY(" + this.position.text_c + "px)")), this.composer.render(), "undefined" != typeof stats && stats.end()
    }
}

jQuery(".anita-gl-roll-gallery").length && jQuery.getScript("js/lib/three.min.js").done(function () {
    jQuery.getScript("js/lib/shaders/composer.js").done(function () {
        new Anita_GL_Roll(jQuery(".anita-gl-roll-gallery"), {container: jQuery(".anita-main"), nav: !0})
    })
})
