docker_compose('./docker-compose.yml')
docker_build('respite:develop', '.', 
  live_update = [
    sync('./api', '/api'),
    sync('./memhunt', '/memhunt'),
    sync('./common', '/memhunt/common'),
    sync('./common', '/api/common'),
    sync('./gui', '/gui'),
    restart_container(),
  ])
