-- Gui to Lua
-- Version: 3.2

-- Instances:

local PlayerCounter = Instance.new("ScreenGui")
local PlayerNumber = Instance.new("TextLabel")
local SlotsLeft = Instance.new("TextLabel")

--Properties:

PlayerCounter.Name = "PlayerCounter"
PlayerCounter.Parent = game.CoreGui

PlayerNumber.Name = "PlayerNumber"
PlayerNumber.Parent = PlayerCounter
PlayerNumber.Active = true
PlayerNumber.BackgroundColor3 = Color3.fromRGB(219, 219, 219)
PlayerNumber.BackgroundTransparency = 0.500
PlayerNumber.BorderColor3 = Color3.fromRGB(0, 0, 0)
PlayerNumber.Position = UDim2.new(0, 0, 0, 410)
PlayerNumber.Size = UDim2.new(0, 128, 0, -20)
PlayerNumber.Text = "Players Online : XX of XX"
PlayerNumber.TextColor3 = Color3.fromRGB(0, 0, 0)

SlotsLeft.Name = "SlotsLeft"
SlotsLeft.Parent = PlayerCounter
SlotsLeft.Active = true
SlotsLeft.BackgroundColor3 = Color3.fromRGB(219, 219, 219)
SlotsLeft.BackgroundTransparency = 0.500
SlotsLeft.BorderColor3 = Color3.fromRGB(0, 0, 0)
SlotsLeft.Position = UDim2.new(0, 0, 0, 430)
SlotsLeft.Size = UDim2.new(0, 128, 0, -20)
SlotsLeft.Text = "Slots Left : XX"
SlotsLeft.TextColor3 = Color3.fromRGB(0, 0, 0)

-- Scripts:

local function FXGAA_fake_script() -- PlayerNumber.Script 
	local script = Instance.new('Script', PlayerNumber)

	while true do
	wait(0.125)
	script.Parent.Text = "Players Online : " ..game.Players.NumPlayers.. " of " ..game.Players.MaxPlayers 
	end
	
end
coroutine.wrap(FXGAA_fake_script)()
local function BUDKT_fake_script() -- SlotsLeft.Script 
	local script = Instance.new('Script', SlotsLeft)

	while true do
	wait(0.125) 
	local sleft = game.Players.MaxPlayers - game.Players.NumPlayers 
	script.Parent.Text = "Slots Left : " ..sleft 
	end
	
end
coroutine.wrap(BUDKT_fake_script)()
