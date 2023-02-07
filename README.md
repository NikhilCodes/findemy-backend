# Findemy Backend

### Deployment
```shell
docker buildx build --platform linux/amd64 -t findemy-backend . 
docker tag findemy-backend:latest 042850181621.dkr.ecr.ap-south-1.amazonaws.com/findemy-backend:latest
docker push 042850181621.dkr.ecr.ap-south-1.amazonaws.com/findemy-backend:latest
kubectl rollout restart deployment/api
```
