import random
import time
import json
import asyncio
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
        self.paddles = {
            'left': {'left': 10, 'top': 300, 'keydown': False, 'keyup': False},
            'right': {'left': 768, 'top': 300, 'keydown': False, 'keyup': False}
        }
        self.paddle_speed = 20
        self.paddle_height = 120
        self.paddle_width = 32

        self.height = 600
        self.width = 800
        self.last_update = time.time()
        
        self.leftPaddle_x = 10
        self.rightPaddle_x = 768

        self.ball_x = 50
        self.ball_y = 50
        self.ball_speed_x = 20
        self.ball_speed_y = 20
        self.ball_radius = 10

        self.leftScore = 0
        self.rightScore = 0

        self.minutes = -1
        self.seconds = -1

    async def game_start(self):
        self.leftScore = 0
        self.rightScore = 0
        self.minutes = 1
        self.seconds = 0
        self.ball_x = self.width / 2
        self.ball_y = self.height / 2
        self.ball_speed_x = random.randint(5, 10) * random.choice([1, -1])
        self.ball_speed_y = random.randint(5, 10) * random.choice([1, -1])
        self.paddles['left']['top'] = self.height / 2 - self.paddle_height / 2
        self.paddles['right']['top'] = self.height / 2 - self.paddle_height / 2
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
                    sent = False    
                    await self.set_game_state(GameState.SETTING)
                continue

    async def goal_reset(self):
        if self.leftScore >= 10 or self.rightScore >= 10:
            await self.set_game_state(GameState.GAME_OVER)
        else:
            self.ball_x = self.width / 2
            self.ball_y = self.height / 2
            self.ball_speed_x = random.randint(5, 10) * random.choice([1, -1])
            self.ball_speed_y = random.randint(5, 10) * random.choice([1, -1])
            self.paddles['left']['top'] = self.height / 2 - self.paddle_height / 2
            self.paddles['right']['top'] = self.height / 2 - self.paddle_height / 2
            self.game_state = GameState.GOAL
            await self.send_paddle_positions()
    
    async def connect(self):
        self.game_state = GameState.SETTING
        print("ws 연결요청")
        # self.user = self.scope['url_route']['kwargs']['username']
        # print(f"유저 {self.user} 연결")
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
        self.ball_x += self.ball_speed_x
        self.ball_y += self.ball_speed_y

        # 천장과 바닥에 부딪히면 방향을 바꿈
        if self.ball_y - self.ball_radius < 0:
            self.ball_speed_y = abs(self.ball_speed_y)
        elif self.ball_y + self.ball_radius > self.height:
            self.ball_speed_y = -abs(self.ball_speed_y)
        
        # 왼쪽 패들과 부딪히면 방향을 바꿈
        if self.ball_speed_x < 0 \
            and self.ball_x - self.ball_radius \
            <= self.paddles['left']['left'] + self.paddle_width \
            and self.paddles['left']['top']\
            <= self.ball_y + self.ball_radius\
            <= self.paddles['left']['top'] + self.paddle_height:
            self.ball_speed_x = abs(self.ball_speed_x)

            # 패들의 방향에 따라 공에게 추가 속도를 줌
            if self.paddles['left']['keydown']:
                self.ball_speed_y += 5
            elif self.paddles['left']['keyup']:
                self.ball_speed_y -= 5
        
        # 오른쪽 패들과 부딪히면 방향을 바꿈
        if self.ball_speed_x > 0 \
            and self.ball_x + self.ball_radius \
            >= self.paddles['right']['left']\
            and self.paddles['right']['top']\
            <= self.ball_y + self.ball_radius\
            <= self.paddles['right']['top'] + self.paddle_height:
            self.ball_speed_x = -abs(self.ball_speed_x)

            # 패들의 방향에 따라 공에게 추가 속도를 줌
            if self.paddles['right']['keydown']:
                self.ball_speed_y += 5
            elif self.paddles['right']['keyup']:
                self.ball_speed_y -= 5
        
        # 공의 최고 속도를 제한
        self.ball_speed_x = max(-10, min(10, self.ball_speed_x))
        self.ball_speed_y = max(-10, min(10, self.ball_speed_y))

        # 왼쪽 벽에 부딪히면 오른쪽이 골
        if self.ball_x - self.ball_radius < 0:
            self.rightScore += 1
            await self.goal_reset()
        
        # 오른쪽 벽에 부딪히면 왼쪽이 골
        if self.ball_x + self.ball_radius > self.width:
            self.leftScore += 1
            await self.goal_reset()
        
        await self.send_ball_position()
    
    async def move_paddles(self):
        if self.game_state != GameState.PLAYING:
            return

        moved = False
        
        if self.paddles['left']['keydown']:
            self.paddles['left']['top'] += self.paddle_speed
            moved = True
        if self.paddles['left']['keyup']:
            self.paddles['left']['top'] -= self.paddle_speed
            moved = True
        if self.paddles['right']['keydown']:
            self.paddles['right']['top'] += self.paddle_speed
            moved = True
        if self.paddles['right']['keyup']:
            self.paddles['right']['top'] -= self.paddle_speed
            moved = True

        height = self.height - self.paddle_height
        self.paddles['left']['top'] = max(0, min(height, self.paddles['left']['top']))
        self.paddles['right']['top'] = max(0, min(height, self.paddles['right']['top']))
        
        if moved:
            await self.send_paddle_positions()
    
    async def game_loop(self):
        try:
            while True:
                await self.move_ball()
                await self.move_paddles()
                await asyncio.sleep(0.03)
        except asyncio.CancelledError:
                pass
        except Exception as e:
                print(e)
    
    # 패들의 위치를 클라이언트에게 보냄, 패들의 위치를 퍼센트로 변환
    async def send_paddle_positions(self):
        left_paddle_percent = self.paddles['left']['top'] / (self.height) * 100
        right_paddle_percent = self.paddles['right']['top'] / (self.height) * 100

        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddles': {
                'left': {'top': left_paddle_percent},
                'right': {'top': right_paddle_percent}
            }
        }))
    
    # 공의 위치를 클라이언트에게 보냄, 공의 위치를 퍼센트로 변환
    async def send_ball_position(self):
        ball_x_percent = self.ball_x * 100 / self.width
        ball_y_percent = self.ball_y * 100 / self.height

        await self.send(text_data=json.dumps({
            'type': 'ball_update',
            'ball': {'x': ball_x_percent, 'y': ball_y_percent}
        }))


    async def send_message(self, custom_message = None):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': custom_message
        }))
    
    async def send_update(self):
        await self.send(text_data=json.dumps({
            'type': 'update',
            'paddles': self.paddles,
            'ball': {'x': self.ball_x, 'y': self.ball_y},
            'scores': {'left': self.leftScore, 'right': self.rightScore},
            'time': {'min': self.minutes, 'sec': self.seconds}
        }))