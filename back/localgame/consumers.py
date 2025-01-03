import random
import time
import json
import asyncio
import math
from enum import Enum
from channels.generic.websocket import AsyncWebsocketConsumer

class GameState(Enum):
    SETTING = 0
    GAME_START = 1
    PLAYING = 2
    GOAL = 3
    GAME_OVER = 4

class PongConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.table_width = 700    
        self.table_depth = 500  
        self.table_height = 0   

        self.height = 600  
        self.width = 800   
        self.depth = self.table_depth  

        self.paddle_speed = 8
        self.max_ball_speed = 15
        self.ball_radius = 6

        self.paddle_max_distance = 200  
        self.paddle_initial_z = 0 
     

        self.paddles = {
            'left': {
                'x': -358,  
                'y': self.table_height + 2,  
                'z': self.paddle_initial_z,   
                'keyup': False,
                'keydown': False,
            },
            'right': {
                'x': 358,   
                'y': self.table_height + 2,  
                'z': self.paddle_initial_z,   
                'keyup': False,
                'keydown': False,
            }
        }

    async def game_start(self):
        # 점수 및 시간 초기화
        self.leftScore = 0
        self.rightScore = 0
        self.minutes = 1
        self.seconds = 40

        self.paddles['left'] = {
            'x': -358,
            'y': self.table_height + 2,
            'z': self.paddle_initial_z,
            'keyup': False,
            'keydown': False,
        }
        self.paddles['right'] = {
            'x': 358,
            'y': self.table_height + 2,
            'z': self.paddle_initial_z,
            'keyup': False,
            'keydown': False,
        }

        # 공 초기 위치 및 속도 설정 (3D)
        self.ball_x = 0  # 중앙
        self.ball_y = self.table_height + 50 # 테이블 위
        self.ball_z = 0  # 중앙
        
        # 3D 공간에서의 초기 속도
        speed = random.randint(2, 4)
        angle = random.uniform(-0.5, 0.5)  # 좌우 랜덤 각도
        self.ball_speed_x = speed * random.choice([-1, 1])  # 좌/우 랜덤
        self.ball_speed_y = 0  # 처음에는 수직 속도 없음
        self.ball_speed_z = speed * angle  # 약간의 각도

        await self.send_update()

    async def game_over_message(self): # 게임이 끝났을 때 메시지를 보내는 함수
        if self.leftScore == self.rightScore:
            message = 'Draw'
        else:
            message = ('Left' if self.leftScore > self.rightScore else 'Right') + ' wins!'
        await self.send_message(message)
    
    async def set_game_state(self, state): # 게임 상태를 설정하는 함수
        self.game_state = state

    async def update(self):
        counter = 4
        sent = False # 메시지를 중복으로 보내지 않기 위한 변수

        while True:
            await asyncio.sleep(1)

            if self.game_state == GameState.SETTING:
                if not sent:
                    sent = True
                    await self.send_message(custom_message = 'none')
                continue
            
            if self.game_state == GameState.GAME_START:
                sent = False
                await self.game_start()
                counter -= 1
                await self.send_message(custom_message = 'Game starts in ' + str(counter))
                if counter == 0:
                    await self.set_game_state(GameState.PLAYING)
                    counter = 4
                    await self.send_message(custom_message = 'none')
                continue
            
            if self.game_state == GameState.PLAYING:
                if self.seconds > 0:
                    self.seconds -= 1
                else:
                    if self.minutes > 0:
                        self.minutes -= 1
                        self.seconds = 59
                    else:
                        await self.set_game_state(GameState.GAME_OVER)
                await self.send_update()
                continue
            
            if self.game_state == GameState.GOAL:
                counter -= 1
                if counter > 0:
                    await self.send_message(custom_message = str(counter))
                else:
                    await self.set_game_state(GameState.PLAYING)
                    counter = 4
                    await self.send_message(custom_message = 'none')
                await self.send_update()
                continue
            
            if self.game_state == GameState.GAME_OVER:
                if not sent:
                    sent = True
                    await self.game_over_message()
                counter -= 1
                if counter == 0:
                    await self.send_message(custom_message = 'menu')
                    counter = 4
                    sent = True  
                    await self.set_game_state(GameState.SETTING)
                continue

    async def goal_reset(self):
        if self.leftScore >= 11 or self.rightScore >= 11:
            await self.set_game_state(GameState.GAME_OVER)
        else:
            # 공의 초기 위치를 테이블 중앙 위로 설정
            self.ball_x = 0
            self.ball_y = self.table_height + 10
            self.ball_z = 0
            
            # 속도 재설정
            speed = random.randint(2, 4)
            angle = random.uniform(-0.5, 0.5)
            self.ball_speed_x = speed * random.choice([-1, 1])
            self.ball_speed_y = 0
            self.ball_speed_z = speed * angle
    
    async def connect(self):
        self.game_state = GameState.SETTING
        print("ws 연결요청")
        await self.accept()
        self.move_task = asyncio.create_task(self.game_loop())
        asyncio.create_task(self.update())
    
    async def disconnect(self, close_code):
        self.move_task.cancel()
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data['type']
        key = data.get('key')
        if event_type == 'keyup':
            await self.handle_keyup(key)
        elif event_type == 'keydown':
            await self.handle_keydown(key)
        elif event_type == 'start_game':
            await self.set_game_state(GameState.GAME_START)
        elif event_type == 'reset_game':
            await self.set_game_state(GameState.SETTING)
    
    async def handle_keydown(self, key):
        if key == 'w':
            self.paddles['left']['keyup'] = True
        elif key == 's':
            self.paddles['left']['keydown'] = True
        elif key == 'ArrowUp': 
            self.paddles['right']['keyup'] = True
        elif key == 'ArrowDown':
            self.paddles['right']['keydown'] = True

    async def handle_keyup(self, key):
        if key == 'w':
            self.paddles['left']['keyup'] = False
        elif key == 's':
            self.paddles['left']['keydown'] = False
        elif key == 'ArrowUp':
            self.paddles['right']['keyup'] = False
        elif key == 'ArrowDown':
            self.paddles['right']['keydown'] = False
    
    async def move_ball(self):
        if self.game_state != GameState.PLAYING:
            return
        # 테이블 상하단 벽 충돌 처리
        if abs(self.ball_z) >= self.table_depth/2 - self.ball_radius:
            # 충돌 방향 반전
            self.ball_z = (self.table_depth/2 - self.ball_radius) * (self.ball_z/abs(self.ball_z))
            self.ball_speed_z *= -0.9  # 약간의 에너지 손실
        # 공 위치 업데이트
        self.ball_x += self.ball_speed_x
        self.ball_y += self.ball_speed_y
        self.ball_z += self.ball_speed_z

        # 중력 효과
        self.ball_speed_y -= 0.4
        
        # 탁구대 바운스
        if self.ball_y <= self.table_height + self.ball_radius:
            # 테이블 범위 내에서만 바운스
            if (abs(self.ball_x) <= self.table_width/2 and 
                abs(self.ball_z) <= self.table_depth/2):
                self.ball_y = self.table_height + self.ball_radius
                self.ball_speed_y = abs(self.ball_speed_y) * 0.7  # 에너지 손실
            else:
                # 테이블 밖으로 나가면 점수 처리
                if self.ball_x < 0:
                    self.rightScore += 1
                else:
                    self.leftScore += 1
                await self.goal_reset()
                return

        # 속도 제한
        for attr in ['ball_speed_x', 'ball_speed_y', 'ball_speed_z']:
            speed = getattr(self, attr)
            if abs(speed) > self.max_ball_speed:
                setattr(self, attr, self.max_ball_speed * (speed/abs(speed)))

        # 패들과의 충돌 검사
        for side, paddle in self.paddles.items():
            if ((side == 'left' and self.ball_speed_x < 0) or 
                (side == 'right' and self.ball_speed_x > 0)):
                
                if (abs(self.ball_x - paddle['x']) <= 15 and
                    abs(self.ball_y - paddle['y']) <= 20 and
                    abs(self.ball_z - paddle['z']) <= 20):
                    
                    # 라켓에 맞으면 방향 전환
                    self.ball_speed_x *= -1.1  # 약간 가속
                    
                    # 라켓의 위치에 따른 z축 방향 변화
                    z_diff = self.ball_z - paddle['z']
                    self.ball_speed_z += z_diff * 0.3
                    
                    # y축 방향 영향
                    y_diff = self.ball_y - paddle['y']
                    self.ball_speed_y += y_diff * 0.2

        await self.send_ball_position()
    
    async def move_paddles(self):
        if self.game_state != GameState.PLAYING:
            return

        # 패들 이동 거리 계산
        move_distance = self.paddle_speed

        # 왼쪽 패들 이동 (좌우 방향만)
        if self.paddles['left']['keyup']:  # 위로 이동
            new_z = self.paddles['left']['z'] - move_distance  # 부호 변경
            # 최대 이동 거리 제한
            self.paddles['left']['z'] = max(
                self.paddle_initial_z - self.paddle_max_distance,
                new_z
            )

        if self.paddles['left']['keydown']:  # 아래로 이동
            new_z = self.paddles['left']['z'] + move_distance  # 부호 변경
            # 최대 이동 거리 제한
            self.paddles['left']['z'] = min(
                self.paddle_initial_z + self.paddle_max_distance,
                new_z
            )

        # 오른쪽 패들 이동 (좌우 방향만)
        if self.paddles['right']['keyup']:  # 위로 이동
            new_z = self.paddles['right']['z'] - move_distance  # 부호 변경
            self.paddles['right']['z'] = max(
                self.paddle_initial_z - self.paddle_max_distance,
                new_z
            )

        if self.paddles['right']['keydown']:  # 아래로 이동
            new_z = self.paddles['right']['z'] + move_distance  # 부호 변경
            self.paddles['right']['z'] = min(
                self.paddle_initial_z + self.paddle_max_distance,
                new_z
            )

        await self.send_paddle_positions()

    # send_paddle_positions도 수정
    async def send_paddle_positions(self):
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddles': {
                'left': {
                    'x': self.paddles['left']['x'],
                    'y': self.paddles['left']['y'],
                    'z': self.paddles['left']['z'],
                },
                'right': {
                    'x': self.paddles['right']['x'],
                    'y': self.paddles['right']['y'],
                    'z': self.paddles['right']['z'],
                }
            }
        }))

    async def send_ball_position(self):
        # 3D 볼 위치 전송
        await self.send(text_data=json.dumps({
            'type': 'ball_update',
            'ball': {
                'x': self.ball_x,
                'y': self.ball_y,
                'z': self.ball_z
            }
        }))

    async def game_loop(self):
            try:
                while True:
                    await self.move_ball()
                    await self.move_paddles()
                    await asyncio.sleep(0.016)  # 약 60fps
            except asyncio.CancelledError:
                pass
            except Exception as e:
                print(e)
    
    async def send_message(self, custom_message = None):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': custom_message
        }))
    
    async def send_update(self):
        # 3D 위치 정보를 포함한 업데이트 전송
        await self.send(text_data=json.dumps({
            'type': 'update',
            'paddles': {
                'left': {
                    'x': self.paddles['left']['x'],
                    'y': self.paddles['left']['y'],
                    'z': self.paddles['left']['z'],
                },
                'right': {
                    'x': self.paddles['right']['x'],
                    'y': self.paddles['right']['y'],
                    'z': self.paddles['right']['z'],
                }
            },
            'ball': {
                'x': self.ball_x,
                'y': self.ball_y,
                'z': self.ball_z
            },
            'scores': {
                'left': self.leftScore,
                'right': self.rightScore
            },
            'time': {
                'min': self.minutes,
                'sec': self.seconds
            }
        }))
