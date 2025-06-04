import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.http import MediaFileUpload

def upload_video(file_path, title, description, tags, privacy="private"):
    scopes = ["https://www.googleapis.com/auth/youtube.upload"]

    # OAuth flow
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        "client_secrets.json", scopes)
    credentials = flow.run_console()

    youtube = googleapiclient.discovery.build(
        "youtube", "v3", credentials=credentials)

    # Video metadata
    request_body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": "22"  # People & Blogs
        },
        "status": {
            "privacyStatus": privacy
        }
    }

    # Upload video
    media = MediaFileUpload(file_path, mimetype="video/*", resumable=True)
    request = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    )

    response = request.execute()
    print(f" Video uploaded! Video ID: {response['id']}")

# Example usage
upload_video(
    file_path="your_video.mp4",
    title="My Automated Video Upload",
    description="Uploaded using Python script 😎",
    tags=["python", "youtube api", "automation"],
    privacy="private"
)
