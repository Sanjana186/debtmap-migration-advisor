import requests

def fetch_github_code(github_url):
    try:
        raw_url = github_url.replace("github.com", "raw.githubusercontent.com")
        raw_url = raw_url.replace("/blob/", "/")

        response = requests.get(raw_url)

        if response.status_code == 200:
            return response.text
        else:
            return None

    except Exception as e:
        return None