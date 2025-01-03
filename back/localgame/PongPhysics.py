import math
class PongPhysics:
    def check_wall_collision(self, ball_pos, ball_speed, table_bounds, ball_radius):
        """
        정확한 벽 충돌 검사 및 반사 처리
        """
        collision = False
        new_pos = ball_pos.copy()
        new_speed = ball_speed.copy()
        
        # 상하 벽 충돌
        if abs(ball_pos['z']) >= table_bounds['depth']/2 - ball_radius:
            collision = True
            # 정확한 충돌 위치로 보정
            new_pos['z'] = (table_bounds['depth']/2 - ball_radius) * (ball_pos['z']/abs(ball_pos['z']))
            # 반사 속도 계산 (약간의 에너지 손실)
            new_speed['z'] *= -0.9
            # x, y 속도 감소 (마찰)
            new_speed['x'] *= 0.95
            new_speed['y'] *= 0.95
        
        # 테이블 바운스
        if ball_pos['y'] <= table_bounds['height'] + ball_radius:
            if (abs(ball_pos['x']) <= table_bounds['width']/2 and 
                abs(ball_pos['z']) <= table_bounds['depth']/2):
                collision = True
                new_pos['y'] = table_bounds['height'] + ball_radius
                # 탄성 계수를 고려한 반사
                new_speed['y'] = abs(ball_speed['y']) * 0.7
                # 수평 방향 속도 감소 (마찰)
                new_speed['x'] *= 0.9
                new_speed['z'] *= 0.9
            
        return collision, new_pos, new_speed

    def check_paddle_collision(self, ball_pos, ball_speed, paddle, ball_radius):
        """
        정확한 라켓 충돌 검사 및 반사 처리
        """
        # 라켓의 실제 크기를 고려한 충돌 박스 계산
        paddle_bounds = {
            'min_x': paddle['x'] - 8,  # 라켓 두께의 절반
            'max_x': paddle['x'] + 8,
            'min_y': paddle['y'] - 1,  # 라켓 높이의 절반
            'max_y': paddle['y'] + 1,
            'min_z': paddle['z'] - 50,  # 라켓 길이의 절반
            'max_z': paddle['z'] + 50
        }
        
        # 상세한 충돌 검사
        if (ball_pos['x'] >= paddle_bounds['min_x'] - ball_radius and 
            ball_pos['x'] <= paddle_bounds['max_x'] + ball_radius and
            ball_pos['y'] >= paddle_bounds['min_y'] - ball_radius and 
            ball_pos['y'] <= paddle_bounds['max_y'] + ball_radius and
            ball_pos['z'] >= paddle_bounds['min_z'] - ball_radius and 
            ball_pos['z'] <= paddle_bounds['max_z'] + ball_radius):
            
            # 충돌 지점에 따른 반사각 계산
            z_impact = (ball_pos['z'] - paddle['z']) / 50  # -1 to 1
            y_impact = (ball_pos['y'] - paddle['y']) / 1   # -1 to 1
            
            new_speed = ball_speed.copy()
            
            # 기본 반사
            new_speed['x'] *= -1.1  # 약간의 가속
            
            # 라켓의 curved 표면을 시뮬레이션하는 z축 반사각
            new_speed['z'] += z_impact * 5
            
            # 수직 방향 영향 (탑스핀/언더스핀 효과)
            new_speed['y'] += y_impact * 3
            
            # 속도 정규화
            total_speed = math.sqrt(sum(v*v for v in new_speed.values()))
            if total_speed > 15:  # max_speed
                factor = 15 / total_speed
                new_speed = {k: v*factor for k, v in new_speed.items()}
            
            return True, new_speed
        
        return False, ball_speed

    def apply_gravity(self, ball_speed, gravity=-0.4):
        """
        중력 효과 적용
        """
        new_speed = ball_speed.copy()
        new_speed['y'] += gravity
        return new_speed

    def update_ball_position(self, ball_pos, ball_speed):
        """
        공의 위치 업데이트
        """
        return {
            'x': ball_pos['x'] + ball_speed['x'],
            'y': ball_pos['y'] + ball_speed['y'],
            'z': ball_pos['z'] + ball_speed['z']
        }