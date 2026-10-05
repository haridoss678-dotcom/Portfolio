import http.server
import webbrowser
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Dev server: never let the browser cache, so edits always show on refresh.
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_header(self, keyword, value):
        if keyword.lower() == 'last-modified':
            return
        super().send_header(keyword, value)

class PortfolioServer(http.server.ThreadingHTTPServer):
    """Threaded so one keep-alive browser connection can't block every other request."""
    daemon_threads = True
    # On Windows SO_REUSEADDR lets a second server share a live port, so requests get
    # split between them at random. Disable it there so a busy port fails cleanly.
    allow_reuse_address = os.name != 'nt'


def start_server(port, attempts=10):
    """Bind the first free port from `port`, so a leftover server doesn't crash startup."""
    for candidate in range(port, port + attempts):
        try:
            return PortfolioServer(('', candidate), PortfolioHandler), candidate
        except OSError:
            print(f'Port {candidate} is already in use, trying {candidate + 1}...')
    raise SystemExit(
        f'\nPorts {port}-{port + attempts - 1} are all in use.\n'
        f'Find what is holding one:  netstat -ano | findstr :{port}\n'
        f'Then stop it:              taskkill /PID <pid> /F'
    )


if __name__ == '__main__':
    httpd, port = start_server(PORT)
    with httpd:
        url = f'http://localhost:{port}'
        print(f'Serving portfolio at {url}')
        print('Press Ctrl+C to stop.')
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServer stopped.')
