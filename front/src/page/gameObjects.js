import * as THREE from 'three';
import { Text } from 'troika-three-text';

export function createLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    return ambientLight;
}

// 다른 함수들은 그대로 유지하되, 테이블 크기만 조정
export function createTable(scene) {
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    // 바닥 생성
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xCEB195,
        roughness: 0.8,
        metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -50;
    floor.receiveShadow = true;
    scene.add(floor);

    // 탁구 테이블 상판 생성 (800x600 크기에 맞춤)
    const tableTopGeometry = new THREE.BoxGeometry(800, 0, 600);
    const tableTopMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1B5E20,
        roughness: 0.7,
        metalness: 0.1,
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    return { floor, tableTop };
}

export function createTableLines(scene) {
    const lineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF,
    });

    // 중앙선
    const centerLineGeometry = new THREE.PlaneGeometry(800, 2);
    const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
    centerLine.position.y = 2;
    centerLine.rotation.x = -Math.PI / 2;
    scene.add(centerLine);
    
    // 수직 중앙선
    const verticalCenterLineGeometry = new THREE.PlaneGeometry(2, 600);
    const verticalCenterLine = new THREE.Mesh(verticalCenterLineGeometry, lineMaterial);
    verticalCenterLine.position.y = 2;
    verticalCenterLine.rotation.x = -Math.PI / 2;
    scene.add(verticalCenterLine);

    // 사이드 라인들
    const sideLines = [];
    [-300, 300].forEach(z => {
        const sideLine = new THREE.Mesh(new THREE.PlaneGeometry(800, 2), lineMaterial);
        sideLine.position.set(0, 2, z);
        sideLine.rotation.x = -Math.PI / 2;
        scene.add(sideLine);
        sideLines.push(sideLine);
    });

    // 끝 라인들
    const endLines = [];
    [-400, 400].forEach(x => {
        const endLine = new THREE.Mesh(new THREE.PlaneGeometry(2, 600), lineMaterial);
        endLine.position.set(x, 2, 0);
        endLine.rotation.x = -Math.PI / 2;
        scene.add(endLine);
        endLines.push(endLine);
    });

    return {
        centerLine,
        verticalCenterLine,
        sideLines,
        endLines
    };
}

// gameObjects.js의 createPaddle 함수 수정
export function createPaddle(isLeft) {
    const paddleGroup = new THREE.Group();
    const paddleGeometry = new THREE.BoxGeometry(10, 200, 120); // 가로(width), 높이(height), 깊이
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: isLeft ? 0x4169E1 : 0xFF4500,
        roughness: 0.6,
        metalness: 0.3,
    });

    const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.castShadow = true;
    paddle.receiveShadow = true;
    
    // 초기 위치 설정
    const x = isLeft ? -354 : 354;
    paddleGroup.position.set(x, 0, 0);  // y는 50으로 고정 (테이블 위)

    paddleGroup.add(paddle);
    return paddleGroup;
}

export function createBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(6);  // consumers.py의 ball_radius와 동일
    const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.7,
    });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.position.set(0, 36, 0);
    scene.add(ball);
    
    return ball;
}


export function createGameTexts(scene, scores, minutes, seconds) {
    // 점수 텍스트
    const scoreText = new Text();
    scoreText.text = `${scores.left} - ${scores.right}`;
    scoreText.fontSize = 40;
    scoreText.color = 0xffffff;
    scoreText.position.set(0, 1, -340);
    scoreText.rotation.x = -Math.PI / 2;
    scoreText.textAlign = 'center';
    scoreText.anchorX = 'center';
    scoreText.anchorY = 'center';
    scoreText.sync();
    scene.add(scoreText);

    // 시간 텍스트
    const timeText = new Text();
    timeText.text = `${minutes}:${seconds}`;
    timeText.fontSize = 20;
    timeText.color = 0xffffff;
    timeText.position.set(0, 1, -300);
    timeText.rotation.x = -Math.PI / 2;
    timeText.textAlign = 'center';
    timeText.anchorX = 'center';
    timeText.anchorY = 'center';
    timeText.sync();
    scene.add(timeText);

    return { scoreText, timeText };
}