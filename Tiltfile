docker_compose('./docker-compose.yml')
docker_build('respite:develop', '.', 
  ignore=[],
  live_update = [
    sync('./api', '/api'),
    sync('./memhunt', '/memhunt'),
    sync('./common', '/memhunt/common'),
    sync('./common', '/api/common'),
    restart_container(),
  ])
