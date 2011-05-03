# Personal Twitter Archive

This is just enough info to get you up and running.

## Alpha Software

This master branch contains the latest code, which is still fairly unstable and flakey. It does work, but I can''t promise much more.

## Installation

First, you need MongoDB running locally, then run

	git clone http://github.com/ewanleith/Personal-Twitter-Archive.git
    cd Personal-Twitter-Archive

	cd server
	node pta_server.js &
	cd ../client

Edit the pta.js file to contain your username then run

	node pta.js &

However, note that github tarballs **do not contain submodules**, so
those won't work.  You'll have to also fetch the appropriate submodules.

Once everything starts cleanly

Point your web browser to the server running pta.js on port 3000, e.g.
	http://127.0.0.1:3000


