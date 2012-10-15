#! /usr/bin/env python3

# https://gist.github.com/3630706

import http.server

httpd = http.server.HTTPServer(
	('localhost', 3000), http.server.SimpleHTTPRequestHandler)
httpd.serve_forever()
