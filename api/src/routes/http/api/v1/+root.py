from nautica.api import MongoDB, Config
from nautica.api.http import Request, Require, Context, Reply 

from src.lib.models.Clockwork import WLStatus, WhitelistApplicationTemplate, ALLOWED_AGE_ANSWERS, ALLOWED_REGION_ANSWERS
from src.lib.Utils import get_mc_uuid

import time
import requests

@Request.GET("test-lookup")
@Require.query(q=str)
async def test_mc_lookup_api(ctx: Context):
    r = requests.get(f"https://playerdb.co/api/player/minecraft/{ctx.query['q']}")
    return Reply(res=r.text), r.status_code

@Request.GET("mc-profile")
@Require.query(username=str)
async def get_mc_profile(ctx: Context):    
    uuid = get_mc_uuid(ctx.query["username"])
    if not uuid:
        return Reply(error="Invalid username"), 400
    
    return Reply(uuid=uuid), 200

# @v2clockbot.route("/discord/<exchange_code>", methods=["POST"])
@Request.POST()
@Require.body(code=str)
async def discord(ctx: Context):
    r = requests.post(f"https://discord.com/api/oauth2/token", data={
        "client_id": Config("capi")("discord.appId"),
        "client_secret": Config("capi")("discord.appSecret"),
        "grant_type": "authorization_code",
        "code": ctx.body["code"],
        "redirect_uri": f"{Config('capi')('serverUrl')}/clockwork",
    })
    
    if r.status_code != 200:
        return Reply(error=r.json().get("error_description", 'Failed to authorize')), 400
    
    data = r.json()
    if "access_token" not in data:
        return Reply(error="Unknown exchange format"), 400
    
    access_token = data["access_token"]
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    r = requests.get("https://discord.com/api/v10/users/@me", headers=headers)
    if r.status_code != 200:
        return Reply(error=r.json().get("error_description", "Failed to get account data")), 400
    
    data = r.json()
    if "id" not in data:
        return Reply(error="No data found"), 400
    
    user = MongoDB("clockbot").users.find_one({"discord": int(data["id"])})
    print(user)
        
    if user is not None and user["whitelist"]["status"] == WLStatus.PENDING.value:
        return Reply(
            error = "Your application is still pending. Please wait for a response from the staff team.",
            reapply_in = user["whitelist"]["reapply_in"]
        ), 429
        
    if user is not None and user["whitelist"]["status"] == WLStatus.APPROVED.value:
        return Reply(
            error = "You are already whitelisted. Please join the server.",
            reapply_in = user["whitelist"]["reapply_in"]
        ), 429
    
    if user is not None and user["whitelist"]["status"] == WLStatus.REJECTED.value and user["whitelist"]["reapply_in"] > time.time():
        return Reply(
            error = "You have been rejected. Please contact the staff team for more information.",
            reapply_in = user["whitelist"]["reapply_in"]
        ), 429
        
    return Reply(
        id = data["id"],
        username = data["username"],
        avatar = data["avatar"],
    )

@Request.POST()
@Require.body(
    discord=str,
    minecraft=str,
    answers=dict
)
async def apply(ctx: Context):

    apply = WhitelistApplicationTemplate()
    apply["discord"] = int(ctx.body["discord"])
    apply["minecraft"] = ctx.body["minecraft"]
    
    for key in apply["answers"].keys():
        if key not in ctx.body["answers"].keys():
            return Reply(error=f"Missing answer for {key}"), 400
        
        
        if key == "age":
            if ctx.body["answers"][key] not in ALLOWED_AGE_ANSWERS:
                return Reply(error=f"Invalid answer for {key}"), 400
        
        if key == "region":            
            if ctx.body["answers"][key] not in ALLOWED_REGION_ANSWERS:
                return Reply(error=f"Invalid answer for {key}"), 400
        
        if key in ["howFound", "goodAt", "friendsPlaying"]:
            if len(str(ctx.body["answers"][key])) > 256:
                return Reply(error=f"Answer for {key} is too long"), 400
            
        if key in ["playedSMPs", "playedCreate"]:
            if not isinstance(ctx.body["answers"][key], bool) and ctx.body["answers"][key] is not None:
                return Reply(error=f"Answer for {key} must be a boolean"), 400
            
        if len(str(ctx.body["answers"][key])) > 512:
            return Reply(error=f"Answer for {key} is too long"), 400

    apply["answers"] = ctx.body["answers"]
    MongoDB("clockbot").whitelist.insert_one(apply)

    return Reply(), 200