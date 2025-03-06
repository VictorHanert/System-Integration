from websockets.sync.client import connect

def send_message():
    with connect("ws://localhost:8000") as websocket:
        websocket.send("Hello, world!")

        response = websocket.recv()
        print(f"Received response: {response}")

send_message()