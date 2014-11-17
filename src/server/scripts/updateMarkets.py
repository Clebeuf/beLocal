from be_local_server.models import *
from datetime import *
from django.core.files import File 
import urllib


#-----------------------------------------------------------------------------------------------------
# MOSS STREET MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="1330 Fairfield Road", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8S 5J1", # Postal Code
	latitude=48.414895, # Latitude
	longitude=-123.347773, #Longitude
)

# Save it
a.save()

# # Create hours for the address
# h1 = OpeningHours(
# 	address=a, # Each opening hour object has to have an address associated with it
# 	weekday=4, # 1 = Monday, ..., 7 = Sunday
# 	from_hour=datetime(2014, 10, 4, 10, 0, 0), # (year, month, day, hour, minute, second)
# 	to_hour=datetime(2014, 10, 4, 14, 0, 0), # (year, month, day, hour, minute, second)
# )

# # Save it
# h1.save()

result = urllib.urlretrieve('http://photos1.blogger.com/blogger/4131/3618/1600/DSCN0212.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Moss Street Market", # Market name
	description="Moss Street Market is a vibrant community market that features Victoria's largest selection of local and organic produce.  The market has over 25 farmers vending with there are over 70 additional vendors offering handmade crafts, cards, clothing, jewelry, purses, toys, glass works, pottery, bath products, preserves, chocolates, baked goods, pesto, salsa, honey, and much much more. The Moss Street Market also has an activity tent for kids and live music each week.", # Market description
	photo=mp
)

m.save()

#-----------------------------------------------------------------------------------------------------
# HUDSON PUBLIC MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="1701 Douglas Street", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8W 0C1", # Postal Code
	latitude=48.429456,
	longitude=-123.36448,

)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=2, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 9, 30, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 18, 30, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()


# Create hours for the address
h2 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=3, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 9, 30, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 18, 30, 0), # (year, month, day, hour, minute, second)
)

# Save it
h2.save()

# Create hours for the address
h3 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=4, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 9, 30, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 18, 30, 0), # (year, month, day, hour, minute, second)
)

# Save it
h3.save()

# Create hours for the address
h4 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=5, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 9, 30, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 18, 30, 0), # (year, month, day, hour, minute, second)
)

# Save it
h4.save()

# Create hours for the address
h5 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=6, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 9, 30, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 17, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h5.save()


result = urllib.urlretrieve('http://www.theq.fm/wp-content/uploads/IMG_1821.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Victoria Public Market", # Market name
	description="Going back to the old-world style of shopping where you know your butcher, your baker, the person who grows your vegetables and the chickens that lay your eggs is what the Victoria Public Market at the Hudson is all about. The Victoria Public Market at the Hudson also offers a year-round indoor farmers' market every Wednesday from 11am - 3pm and a seasonal outdoor farmers market from May to October.", # Market description
	photo=mp
)

m.save()



#-----------------------------------------------------------------------------------------------------
# HUDSON PUBLIC MARKET - INDOOR FARMERS MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="1701 Douglas Street", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8W 0C1", # Postal Code
	latitude=48.429456,
	longitude=-123.36448,

)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a, # Each opening hour object has to have an address associated with it
	weekday=3, # 1 = Monday, ..., 7 = Sunday
	from_hour=datetime(2014, 10, 4, 11, 00, 0), # (year, month, day, hour, minute, second)
	to_hour=datetime(2014, 10, 4, 15, 0, 0), # (year, month, day, hour, minute, second)
)

# Save it
h1.save()



result = urllib.urlretrieve('https://www.google.ca/search?q=victoria+public+market+at+the+hudson&espv=2&biw=1350&bih=805&source=lnms&tbm=isch&sa=X&ei=xDpqVND4H4vnoATouIL4Aw&ved=0CAcQ_AUoAg#facrc=_&imgdii=_&imgrc=cc7HeD-UnmcWRM%253A%3BYTjZkX17JmzivM%3Bhttp%253A%252F%252Fdiscovercanadatours.com%252Fwordpress%252Fwp-content%252Fuploads%252F2013%252F11%252Fvictoriapublicmarket.jpg%3Bhttp%253A%252F%252Fdiscovercanadatours.com%252Fchristmas-at-the-public-market-in-victoria%252F%3B800%3B600') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Victoria Public Market - Indoor Farmers' Market", # Market name
	description="As a subset of the Victoria Public Market at the Hudson, the year-round weekly indoor farmers' market shows off some of the best local farmers and foodmakers that Victoria has to offer.", # Market description
	photo=mp
)

m.save()


#-----------------------------------------------------------------------------------------------------
# HUDSON PUBLIC MARKET - OUTDOOR FARMERS MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="1701 Douglas Street", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8W 0C1", # Postal Code
	latitude=48.429456,
	longitude=-123.36448,

)

# Save it
a.save()

# # Create hours for the address
# h1 = OpeningHours(
# 	address=a, # Each opening hour object has to have an address associated with it
# 	weekday=3, # 1 = Monday, ..., 7 = Sunday
# 	from_hour=datetime(2014, 10, 4, 11, 00, 0), # (year, month, day, hour, minute, second)
# 	to_hour=datetime(2014, 10, 4, 15, 0, 0), # (year, month, day, hour, minute, second)
# )

# # Save it
# h1.save()



result = urllib.urlretrieve('http://sandandfeathers.files.wordpress.com/2013/09/vic-market-2.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Victoria Public Market - Outdoor Farmers' Market", # Market name
	description="As a subset of the Victoria Public Market at The Hudson, the seasonal outdoor farmers' market shows off some of the best local farmers and foodmakers that Victoria has to offer.  The outdoor farmers market runs weekly from May - October, and is held in the back carriageway of The Hudson.", # Market description
	photo=mp
)

m.save()

#-----------------------------------------------------------------------------------------------------
# BASTION SQUARE MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="Bastion Square", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V5H1G9", # Postal Code
	latitude=48.4257621,
	longitude=-123.3684807,
)

# Save it
a.save()

# Create hours for the address
# h1 = OpeningHours(
# 	address=a, # Each opening hour object has to have an address associated with it
# 	weekday=1, # 1 = Monday, ..., 7 = Sunday
# 	from_hour=datetime(2014, 10, 4, 8, 0, 0), # (year, month, day, hour, minute, second)
# 	to_hour=datetime(2014, 10, 4, 16, 0, 0), # (year, month, day, hour, minute, second)
# )

# Save it
h1.save()

result = urllib.urlretrieve('http://3.bp.blogspot.com/-YJyZuPi8q00/Td2D3Eb3TSI/AAAAAAAAAN8/GnSU6r_jsQ8/s1600/DSC_0181.JPG') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Bastion Square Market", # Market name
	description="The Bastion Square Market brings liveliness to Victoria's historic Bastion Square. Every Sunday from May - September, the market includes farmers selling their locally-grown produce and fruits, homemade breads, pastries, honey, preserves, chutneys, and relishes, free range eggs, and much more.  The market also features an eclectic mix of arts, crafts, imports, and entertainment", # Market description
	photo=mp
)

m.save()


#-----------------------------------------------------------------------------------------------------
# JAMES BAY MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="494 Superior St Victoria", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8V 2G9", # Postal Code
	latitude=48.418221,
	longitude=-123.372516,
)

# Save it
a.save()

# Create hours for the address
# h1 = OpeningHours(
# 	address=a, # Each opening hour object has to have an address associated with it
# 	weekday=6, # 1 = Monday, ..., 7 = Sunday
# 	from_hour=datetime(2014, 10, 4, 9, 0, 0), # (year, month, day, hour, minute, second)
# 	to_hour=datetime(2014, 10, 4, 15, 0, 0), # (year, month, day, hour, minute, second)
# )

# Save it
# h1.save()

result = urllib.urlretrieve('http://crdcommunitygreenmap.ca/sites/default/files/James%20Bay%20Market2.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="James Bay Market", # Market name
	description="The James Bay Market features produce, arts, food and live music with an emphasis on products that are homemade, handmade and homegrown.  The market provides an amazing variety of locally grown or made products and runs seasonally from May - October.", # Market description
	photo=mp
)

m.save()


#-----------------------------------------------------------------------------------------------------
# OAKLANDS SUNSET MARKET
#-----------------------------------------------------------------------------------------------------

# Create an address
a = Address(
	addr_line1="Oaklands Community Center, 1-2827 Belmont Ave", # Street number and street name
	city="Victoria", # City
	state="BC", # Province
	country="Canada", # Country
	zipcode="V8R 4B2", # Postal Code
	latitude=48.440987,
	longitude=-123.338325,
)

# Save it
a.save()

# Create hours for the address
# h1 = OpeningHours(
# 	address=a, # Each opening hour object has to have an address associated with it
# 	weekday=6, # 1 = Monday, ..., 7 = Sunday
# 	from_hour=datetime(2014, 10, 4, 16, 30, 0), # (year, month, day, hour, minute, second)
# 	to_hour=datetime(2014, 10, 4, 10, 30, 0), # (year, month, day, hour, minute, second)
# )

# Save it
# h1.save()

result = urllib.urlretrieve('http://crdcommunitygreenmap.ca/sites/default/files/Oaklands%20Community%20Market2.jpg') # image_url is a URL to an image

mp = MarketPhoto(
		image=File(open(result[0]))
)

mp.save()

# Create a market
m = Market(
	address=a, # Each Market object needs an address associated with it (this also associates hours)
	name="Oaklands Sunset Market", # Market name
	description="Every Wednesday from June - September, the Oaklands Sunset Market is in full swing! The market features vendor tables for your weekly veggies, breads, granola, teas, canned and baked goods or browse the many homemade crafts. The market also attracts local food trucks and delicious hot food from around the city.", # Market description
	photo=mp
)

m.save()

