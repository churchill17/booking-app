iBookNova API Documentation
Frontend Integration Guide
Base URL: https://ibooknova.com.ng/booking_api

Understanding Tokens (JWT)
When a user logs in successfully, the API returns a token. This token is like a digital ID card that proves the user is logged in. You must store it in localStorage and send it with every API request that requires authentication.

Storing the token after login:
localStorage.setItem("token", data.token);

Sending the token with protected API requests:
const token = localStorage.getItem("token");

const response = await fetch("API_URL_HERE", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }
});

Important: If the token is missing or expired, the API will return:
{ "success": false, "message": "No token provided" }

Authentication APIs
1. Guest Signup
Field	Value
URL	https://ibooknova.com.ng/booking_api/signup.php
Method	POST
Auth Required	No

Request Body:
{ "firstName": "John", "lastName": "Doe", "email": "john@gmail.com", "password": "123456" }

Success Response:
{ "success": true, "message": "Registration successful! Check your email for your verification code." }

Error Response:
{ "success": false, "message": "Email already exists" }

What to do after success:
•	Store user in localStorage using storeUser()
•	Redirect to /otp page for email verification


2. Guest Login
Field	Value
URL	https://ibooknova.com.ng/booking_api/login.php
Method	POST
Auth Required	No

Request Body:
{ "email": "john@gmail.com", "password": "123456" }

Success Response:
{
    "success": true,
    "message": "Successfully logged in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "email": "john@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "is_guest": 1,
    "is_host": 0
}

What to do after success:
•	Store token: localStorage.setItem("token", data.token)
•	Store user using storeUser() with role based on is_host value
•	If is_host is 1, role = "host". If is_host is 0, role = "guest"
•	Redirect to home page /


3. Owner Signup (List Property)
Field	Value
URL	https://ibooknova.com.ng/booking_api/owner_signup.php
Method	POST
Auth Required	No

Request Body:
{ "firstName": "John", "lastName": "Doe", "email": "john@gmail.com", "password": "123456" }

Success Response:
{ "success": true, "message": "Registration successful! Check your email for your verification code." }

Special case - existing guest upgrading to host:
{ "success": true, "message": "Account upgraded to host successfully" }

What to do after success:
•	Store user with role: "host"
•	Redirect to /otp page
•	After OTP verification, redirect to /list-property/login


4. Verify OTP
Field	Value
URL	https://ibooknova.com.ng/booking_api/verify_otp.php
Method	POST
Auth Required	No

Request Body:
{ "email": "john@gmail.com", "otp": "123456", "role": "guest" }

Note: Send role as "guest" for regular users, "owner" for property owners.

Success Response:
{ "success": true, "message": "Account verified successfully" }

What to do after success:
•	If role is "host" -> redirect to /list-property/login
•	If role is "guest" -> redirect to /


5. Resend OTP
Field	Value
URL	https://ibooknova.com.ng/booking_api/resend_otp.php
Method	POST
Auth Required	No

Request Body:
{ "email": "john@gmail.com" }

Success Response:
{ "success": true, "message": "OTP sent successfully" }

Property Listing API
6. List Property
Field	Value
URL	https://ibooknova.com.ng/booking_api/list_property.php
Method	POST
Auth Required	Yes - Bearer Token

Headers:
{ "Authorization": "Bearer " + token, "Content-Type": "application/json" }

Request Body:
{ "listing": { ...all wizard data }, "legal": { ...legal form data } }

Success Response:
{ "success": true, "message": "Property listed successfully!", "property_id": 1 }

Host Dashboard APIs
All dashboard APIs require a valid Bearer token in the Authorization header.

7. Host Dashboard Stats
Field	Value
URL	https://ibooknova.com.ng/booking_api/host_dashboard.php
Method	GET
Auth Required	Yes - Bearer Token

Success Response:
{
    "success": true,
    "host": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@gmail.com",
        "memberSince": "2026-03-17 17:15:02"
    },
    "stats": {
        "totalProperties": 5,
        "totalBookings": 12,
        "pendingBookings": 3,
        "cancelledBookings": 1,
        "totalEarnings": "150000.00",
        "averageRating": 4.5
    }
}

How to display on dashboard:
Field	Display As	Example
host.firstName + host.lastName	Welcome message	Welcome back, John Doe
stats.totalProperties	Stat card	5 Properties
stats.totalBookings	Stat card	12 Bookings
stats.pendingBookings	Highlighted stat card	3 Pending (show in orange)
stats.cancelledBookings	Stat card	1 Cancelled
stats.totalEarnings	Earnings card	₦150,000.00
stats.averageRating	Star rating	4.5 / 5 stars


8. Host Properties
Field	Value
URL	https://ibooknova.com.ng/booking_api/host_properties.php
Method	GET
Auth Required	Yes - Bearer Token

Success Response:
{
    "success": true,
    "total": 2,
    "properties": [
        {
            "id": 1,
            "name": "Oceanview Suite",
            "type": "apartment",
            "city": "Lagos",
            "country": "Nigeria",
            "price": "25000.00",
            "pricing_type": "per_night",
            "is_approved": 0,
            "is_available": 1,
            "avg_rating": 4.5,
            "total_reviews": 10,
            "total_bookings": 5,
            "main_image": "https://ibooknova.com.ng/.../photo.jpg",
            "amenities": ["Air conditioning", "Free WiFi", "Kitchen"],
            "images": [{ "image_url": "https://...", "is_main": 1 }]
        }
    ]
}

How to display each property card:
Field	Display As	Notes
main_image	Property photo	Show placeholder if null
name	Property title	Bold heading
type	Badge	e.g. Apartment, Hotel
city + country	Location	e.g. Lagos, Nigeria
price + pricing_type	Price	e.g. ₦25,000 / per night
avg_rating	Star rating	Out of 5
total_bookings	Bookings count	e.g. 5 bookings
is_approved = 0	Status badge	Show Pending Approval in orange
is_approved = 1	Status badge	Show Approved in green
amenities	Tags/chips	Show first 3-4 amenities


9. Host Bookings
Field	Value
URL	https://ibooknova.com.ng/booking_api/host_bookings.php
Method	GET
Auth Required	Yes - Bearer Token

Success Response:
{
    "success": true,
    "total": 3,
    "bookings": [
        {
            "booking_id": 1,
            "property_name": "Oceanview Suite",
            "property_type": "apartment",
            "property_city": "Lagos",
            "property_image": "https://...",
            "guest_first_name": "Jane",
            "guest_last_name": "Smith",
            "guest_email": "jane@gmail.com",
            "check_in": "2026-04-01",
            "check_out": "2026-04-05",
            "guests": 2,
            "total_price": "100000.00",
            "status": "pending",
            "payment_status": "unpaid",
            "booking_date": "2026-03-17"
        }
    ]
}

How to display each booking row/card:
Field	Display As	Notes
guest_first_name + guest_last_name	Guest name	e.g. Jane Smith
property_name	Property	e.g. Oceanview Suite
check_in + check_out	Date range	e.g. Apr 1 to Apr 5
guests	Guest count	e.g. 2 guests
total_price	Amount	e.g. ₦100,000
booking_date	Booked on	e.g. Booked on Mar 17, 2026
status = pending	Status badge	Yellow
status = confirmed	Status badge	Green
status = cancelled	Status badge	Red
status = completed	Status badge	Blue
payment_status = unpaid	Payment badge	Red
payment_status = paid	Payment badge	Green
payment_status = refunded	Payment badge	Orange

