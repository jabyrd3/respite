docker_compose('./docker-compose.yml')
docker_build('respite:develop', '.', 
  ignore=['./gui'],
  live_update = [
    sync('./api', '/api'),
    sync('./memhunt', '/memhunt'),
    sync('./common', '/memhunt/common'),
    sync('./common', '/api/common'),
    restart_container(),
  ])
