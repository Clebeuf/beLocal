from be_local_server.models import *
from datetime import *

# MARKET ONE

# Create an address
a = Address(
	addr_line1="1129 Verdier Avenue",
	city="Victoria",
	state="British Columbia",
	country="Canada",
	zipcode="V8M2H1"
)

# Save it
a.save()

# Create hours for the address
h1 = OpeningHours(
	address=a,
	weekday=4,
	from_hour=datetime(2014, 10, 4, 8, 0, 0),
	to_hour=datetime(2014, 10, 4, 16, 0, 0),
)

# Save it
h1.save()

# Create hours for the address
h2 = OpeningHours(
	address=a,
	weekday=6,
	from_hour=datetime.now(),
	to_hour=datetime.now()
)

# Save it
h2.save()

# Create a market
m = Market(
	address=a,
	name="Market",
	description="Market description",
)

# Save it
m.save()