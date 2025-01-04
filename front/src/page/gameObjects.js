import * as THREE from 'three';
import { Text } from 'troika-three-text';

export function createGameTexts(scene, scores, minutes, seconds) {
    // 홀로그램 효과를 위한 쉐이더 material
    const hologramMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 baseColor;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            void main() {
                float scanline = sin(vPosition.y * 50.0 + time * 5.0) * 0.15 + 0.85;
                float glitch = step(0.99, sin(time * 100.0 + vUv.y * 100.0));
                vec3 color = baseColor * scanline;
                color = mix(color, vec3(1.0), glitch * 0.1);
                float alpha = 0.8 + sin(time * 3.0) * 0.2;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

   // 점수 텍스트
   const scoreText = new Text();
   scoreText.text = `${scores.left} - ${scores.right}`;
   scoreText.fontSize = 35;
   scoreText.material = hologramMaterial.clone();
   scoreText.position.set(0, 30, -400);
   scoreText.sync();
   
   // 시간 텍스트
   const timeText = new Text();
   timeText.text = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
   timeText.fontSize = 25;
   timeText.material = hologramMaterial.clone();
   timeText.position.set(0, 30, -340);
   timeText.sync();
   
   // 텍스트를 카메라 방향으로 향하게 하는 함수
   function updateTextOrientation(camera) {
       scoreText.quaternion.copy(camera.quaternion);
       timeText.quaternion.copy(camera.quaternion);
   }
    
    // 애니메이션 업데이트 함수
    function updateHologramEffect() {
        scoreText.material.uniforms.time.value += 0.016;
        timeText.material.uniforms.time.value += 0.016;
    }

    scene.add(scoreText);
    scene.add(timeText);

    return { 
        scoreText, 
        timeText,
        updateHologramEffect,
        updateTextOrientation
    };
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.position.set(0, 700, 300);
    camera.lookAt(0, 200, 100);
    return camera;
}

export function createLights(scene) {
    // 주 조명
    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(0, 1000, 300);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 4096;
    mainLight.shadow.mapSize.height = 4096;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 2000;
    mainLight.shadow.camera.left = -500;
    mainLight.shadow.camera.right = 500;
    mainLight.shadow.camera.top = 500;
    mainLight.shadow.camera.bottom = -500;
    mainLight.shadow.bias = -0.01;
    scene.add(mainLight);

    // 부드러운 주변광
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    return { 
        mainLight, 
        ambientLight
    };
}

export function createTable(scene) {
    // 바닥 생성
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    const floorTexture = new THREE.TextureLoader().load('woodFloor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        map: floorTexture,
        roughness: 0.8,
        metalness: 0.2,
        bumpMap: floorTexture,
        bumpScale: 0.1,
        envMapIntensity: 1.0
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -50;
    floor.receiveShadow = true;
    scene.add(floor);

    // 테이블 상판
    const tableTopGeometry = new THREE.BoxGeometry(800, 5, 600, 50, 5, 50);
    const tableTopMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x1B5E20,
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.0
    });
    
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    // 테이블 다리
    const legGeometry = new THREE.BoxGeometry(10, 45, 10);
    const legMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x424242,
        roughness: 0.7,
        metalness: 0.3,
        clearcoat: 0.5
    });

    const legs = [];
    const legPositions = [
        [-390, -25, 290],
        [-390, -25, -290],
        [390, -25, 290],
        [390, -25, -290]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        scene.add(leg);
        legs.push(leg);
    });

    return { floor, tableTop, legs };
}

export function createTableLines(scene) {
    const lineMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xFFFFFF,
        emissive: 0x888888,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0
    });

    // 중앙선
    const centerLineGeometry = new THREE.PlaneGeometry(800, 4);
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.position.y = 4;
    centerLine.rotation.x = -Math.PI / 2;
    scene.add(centerLine);
    
    // 수직 중앙선
    const verticalCenterLineGeometry = new THREE.PlaneGeometry(3, 600);
    const verticalCenterLine = new THREE.Mesh(verticalCenterLineGeometry, lineMaterial);
    verticalCenterLine.position.y = 4;
    verticalCenterLine.rotation.x = -Math.PI / 2;
    scene.add(verticalCenterLine);

    // 사이드 라인
    const sideLines = [];
    [-300, 300].forEach(z => {
        const sideLine = new THREE.Mesh(new THREE.PlaneGeometry(800, 3), lineMaterial);
        sideLine.position.set(0, 4, z);
        sideLine.rotation.x = -Math.PI / 2;
        scene.add(sideLine);
        sideLines.push(sideLine);
    });

    // 끝 라인
    const endLines = [];
    [-400, 400].forEach(x => {
        const endLine = new THREE.Mesh(new THREE.PlaneGeometry(3, 600), lineMaterial);
        endLine.position.set(x, 4, 0);
        endLine.rotation.x = -Math.PI / 2;
        scene.add(endLine);
        endLines.push(endLine);
    });

    // 발광 효과를 위한 라인 복제
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    [centerLine, verticalCenterLine, ...sideLines, ...endLines].forEach(line => {
        const glowLine = line.clone();
        glowLine.material = glowMaterial;
        glowLine.position.y += 0.1;
        scene.add(glowLine);
    });

    return { centerLine, verticalCenterLine, sideLines, endLines };
}

export function createPaddle(isLeft) {
    const paddleGroup = new THREE.Group();

    // 라켓 헤드의 우드 부분 (5겹 합판)
    const woodGeometry = new THREE.CylinderGeometry(35, 35, 5, 64);  // 3mm 두께
    const woodMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513,
        roughness: 0.5,
        metalness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        emissive: 0x3d2314,
        emissiveIntensity: 0.3
    });
    const wood = new THREE.Mesh(woodGeometry, woodMaterial);
    wood.rotation.x = Math.PI / 2;
    wood.position.z = 2.5;

    // 스폰지 층
    const spongeGeometry = new THREE.CylinderGeometry(35, 35, 3, 64);
    const spongeMaterial = new THREE.MeshPhysicalMaterial({
        color: isLeft ? 0xFFE4E1 : 0x696969,
        roughness: 0.8,
        metalness: 0.1,
        transmission: 0.1,
        emissive: isLeft ? 0xFF8C8C : 0x404040,
        emissiveIntensity: 0.2
    });
    const sponge = new THREE.Mesh(spongeGeometry, spongeMaterial);
    sponge.rotation.x = Math.PI / 2;
    sponge.position.z = 2.5;

    // 러버 표면 (탑시트)
    const rubberGeometry = new THREE.CylinderGeometry(35, 35, 2, 64);
    const rubberMaterial = new THREE.MeshPhysicalMaterial({
        color: isLeft ? 0xFF0000 : 0x000000,
        roughness: 0.8,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.5,
        emissive: isLeft ? 0x800000 : 0x000000,
        emissiveIntensity: 0.2
    });
    const rubber = new THREE.Mesh(rubberGeometry, rubberMaterial);
    rubber.rotation.x = Math.PI / 2;  // sponge와 같은 회전 적용
    rubber.position.z = 2.5;  // sponge보다 앞쪽에 위치

    // 러버 표면 텍스처 추가
    const textureCanvas = document.createElement('canvas');
    const ctx = textureCanvas.getContext('2d');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    
    ctx.fillStyle = isLeft ? '#800000' : '#000000';  // 더 어두운 배경색
    ctx.fillRect(0, 0, 256, 256);
    
    // 딤플 패턴 생성
    ctx.fillStyle = isLeft ? '#600000' : '#0A0A0A';  // 더 어두운 딤플
    for(let i = 0; i < 32; i++) {
        for(let j = 0; j < 32; j++) {
            if((i + j) % 2 === 0) {
                ctx.beginPath();
                ctx.arc(i * 8 + 4, j * 8 + 4, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    const rubberTexture = new THREE.CanvasTexture(textureCanvas);
    rubber.material.map = rubberTexture;
    rubber.material.bumpMap = rubberTexture;
    rubber.material.bumpScale = 0.2;

    // 손잡이 - FL(플레어) 타입
    const handleGeometry = new THREE.CylinderGeometry(3, 4.5, 40, 8);
    const handleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x8B4513,
        roughness: 0.6,
        metalness: 0.2,
        clearcoat: 0.5,
        emissive: 0x3d2314,
        emissiveIntensity: 0.2
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -55;

    // 손잡이 상단 장식
    const handleTopGeometry = new THREE.CylinderGeometry(5, 5, 3, 8);
    const handleTopMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x2F4F4F,
        roughness: 0.4,
        metalness: 0.6,
        emissive: 0x1F3F3F,
        emissiveIntensity: 0.2
    });
    const handleTop = new THREE.Mesh(handleTopGeometry, handleTopMaterial);
    handleTop.position.y = -35;

    paddleGroup.add(wood);
    paddleGroup.add(sponge);
    paddleGroup.add(rubber);
    paddleGroup.add(handle);
    paddleGroup.add(handleTop);

    // 위치 및 회전 설정
    const x = isLeft ? -354 : 354;
    paddleGroup.position.set(x, 75, 0);
    paddleGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;

    // 그룹 내 모든 메쉬에 그림자 설정 적용
    paddleGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    return paddleGroup;
}

export function createBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(6, 64, 64);
    const ballMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xFFFFFF,
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.0
    });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.position.set(0, 36, 0);
    
    // 트레일 설정
    const trailLength = 15; // 트레일 길이를 조금 줄임
    const positions = new Float32Array(trailLength * 3);
    const colors = new Float32Array(trailLength * 3);
    const opacities = new Float32Array(trailLength);
    
    // 모든 초기 위치를 공의 현재 위치로 설정
    for (let i = 0; i < trailLength; i++) {
        const idx = i * 3;
        positions[idx] = ball.position.x;
        positions[idx + 1] = ball.position.y;
        positions[idx + 2] = ball.position.z;
        opacities[i] = 1.0 - (i / trailLength);
    }

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const trailMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    
    // userData 초기화
    ball.userData = {
        trail: trail,
        trailPositions: positions,
        trailColors: colors,
        trailOpacities: opacities,
        trailLength: trailLength,
        previousPosition: ball.position.clone(),
        accumulatedTime: 0,
        trailActive: true
    };
    
    scene.add(ball);
    scene.add(trail);
    
    return { ball, trail };
}
