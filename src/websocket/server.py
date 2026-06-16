import json
import websockets

async def handle_client(websocket): # Handle incoming WebSocket connections
    print ("Client connected")
    try:
        async for message in websocket: # Listen for messages from the client ("async" lets python handle other tasks while waiting for messages)
            print("Received:", message)

            try:
                payload = json.loads(message) # Try to parse the message as JSON
            except json.JSONDecodeError:
                error_response = {
                    "status": "error",
                    "message": "Invalid JSON format"
                }
                await websocket.send(json.dumps(error_response)) # Send an error response back to the client
                continue # Skip to the next message if parsing fails

            response = {
                "status": "success",
                "echo": "ok"          
            }
            await websocket.send(json.dumps(response)) # Send a JSON response back to the client ("await" allows other tasks to run while waiting for the send to complete)

    except websockets.ConnectionClosed: # Handle client disconnection
        print("Client disconnected")

async def start_server():
    print("Starting WebSocket server on ws://localhost:8765")
    server = await websockets.serve(handle_client, "0.0.0.0", 8765) # Start the WebSocket server on all interfaces at port 8765
    await server.wait_closed() # Keep the server running until it is closed