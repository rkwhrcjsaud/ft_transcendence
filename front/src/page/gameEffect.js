// gameEffect.js
import * as THREE from 'three';

export function updateTrailEffect(ball, deltaTime) {
    if (!ball.userData || !ball.userData.trailActive) return;

    ball.userData.accumulatedTime = (ball.userData.accumulatedTime || 0) + deltaTime;
    const UPDATE_INTERVAL = 1/100;
    
    if (ball.userData.accumulatedTime < UPDATE_INTERVAL) {
        return;
    }

    const {
        trailPositions: positions,
        trailColors: colors,
        trailOpacities: opacities,
        trailLength,
        trail,
        previousPosition
    } = ball.userData;

    const currentPos = ball.position;
    const movementVector = currentPos.clone().sub(previousPosition);
    const distance = movementVector.length();

    // 최대 허용 이동 거리 (이보다 크면 텔레포트로 간주)
    const MAX_ALLOWED_DISTANCE = 20;
    
    if (distance > MAX_ALLOWED_DISTANCE) {
        // 급격한 위치 변화 감지 - 트레일 리셋
        for (let i = 0; i < trailLength; i++) {
            const idx = i * 3;
            positions[idx] = currentPos.x;
            positions[idx + 1] = currentPos.y;
            positions[idx + 2] = currentPos.z;
            opacities[i] = 0;
        }
    } else if (distance > 0.1) {
        // 정상적인 움직임
        const normalizedMovement = movementVector.normalize();
        
        // 트레일 위치 업데이트
        for (let i = trailLength - 1; i > 0; i--) {
            const currentIdx = i * 3;
            const prevIdx = (i - 1) * 3;
            
            // 이전 위치와 현재 위치 사이의 거리 검사
            const prevPoint = new THREE.Vector3(
                positions[prevIdx],
                positions[prevIdx + 1],
                positions[prevIdx + 2]
            );
            
            const currentPoint = new THREE.Vector3(
                positions[currentIdx],
                positions[currentIdx + 1],
                positions[currentIdx + 2]
            );

            // 트레일 포인트 간의 최대 거리 제한
            const segmentVector = prevPoint.clone().sub(currentPoint);
            const segmentDistance = segmentVector.length();
            
            if (segmentDistance > MAX_ALLOWED_DISTANCE * 0.5) {
                // 거리가 너무 멀면 이전 점 근처로 이동
                const limitedPoint = prevPoint.clone().sub(
                    normalizedMovement.clone().multiplyScalar(MAX_ALLOWED_DISTANCE * 0.3)
                );
                positions[currentIdx] = limitedPoint.x;
                positions[currentIdx + 1] = limitedPoint.y;
                positions[currentIdx + 2] = limitedPoint.z;
            } else {
                // 정상적인 위치 업데이트
                positions[currentIdx] = positions[prevIdx];
                positions[currentIdx + 1] = positions[prevIdx + 1];
                positions[currentIdx + 2] = positions[prevIdx + 2];
            }
            
            opacities[i] = opacities[i - 1] * 0.95;
        }

        // 첫 번째 점 업데이트
        positions[0] = currentPos.x;
        positions[1] = currentPos.y;
        positions[2] = currentPos.z;
        opacities[0] = Math.min(1.0, 0.5 + (distance / MAX_ALLOWED_DISTANCE));
    } else {
        // 느린 움직임 - 페이드아웃
        for (let i = 0; i < trailLength; i++) {
            opacities[i] = Math.max(0, opacities[i] - deltaTime * 2);
        }
    }

    // 색상 업데이트
    for (let i = 0; i < trailLength; i++) {
        const idx = i * 3;
        const fadeOutFactor = 1 - (i / trailLength);
        const opacity = opacities[i] * fadeOutFactor;
        
        colors[idx] = opacity;
        colors[idx + 1] = opacity;
        colors[idx + 2] = opacity;
    }

    // 위치 업데이트
    previousPosition.copy(currentPos);

    // Geometry 업데이트
    trail.geometry.attributes.position.needsUpdate = true;
    trail.geometry.attributes.color.needsUpdate = true;
    
    ball.userData.accumulatedTime = 0;
}