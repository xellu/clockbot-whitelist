import time
from src.lib.Utils import RandomStr
from enum import Enum

ALLOWED_AGE_ANSWERS = ["13 or younger", "14-15", "16-17", "18 or older"]
ALLOWED_REGION_ANSWERS = ["Europe", "Asia", "North America", "South America", "Oceania", "Africa"]

class WLStatus(Enum):
    INACTIVE = "Inactive"
    PENDING = "Pending"
    REJECTED = "Rejected"
    APPROVED = "Approved"

def WhitelistApplicationTemplate():
    return {
        "id": RandomStr(16),
        "created_at": time.time(),
        
        "discord": None,
        "minecraft": None,
        
        "answers": {
            "age": "N/A", #How old are you?
            "region": "N/A", #What region are you from?
            "howFound": [], #How did you find us?
            "whyJoin": "N/A", #what interests you about the server?
            "playedSMPs": False, #Have you played on any other SMPs?
            "playedCreate": False, #Have you played with Create before?
            "goodAt": [], #What are you good at?
            "joinTown": "N/A", #Do you want to be a part of any town/city?
            "friendsPlaying": [], #Do you have any friends playing on the server?
            "note": "N/A", #Anything else you want to add?
        }
    }