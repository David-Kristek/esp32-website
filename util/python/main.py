import sys
import json


def main(arguments):
    data = json.loads(arguments)
    send = {
        "heating": True,
        "heatingTemperature": data["curTemp"] + 2
    }
    print(json.dumps(send))


main(sys.argv[1])

def handleStuff(): 
    return False