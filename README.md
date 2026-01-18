# Blue-Green Deployment Project

## Prerequisites
- Docker Desktop
- Minikube
- kubectl
- Helm
- Node.js
- Git
  
---

## Project Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd blue-green-project
```

<img width="953" height="509" alt="Screenshot 2026-01-11 185149" src="https://github.com/user-attachments/assets/00a9a4cf-c769-4deb-9b3b-28efc8854695" />

---

<img width="956" height="511" alt="Screenshot 2026-01-17 183850" src="https://github.com/user-attachments/assets/e0d9f054-c2ed-4069-9f6e-9ce1ec10d358" />

---

### 2. Local Development

#### Backend Setup
1. Navigate to backend directory
2. Install dependencies
```bash
cd backend
npm install
```
---

<img width="958" height="509" alt="Screenshot 2026-01-17 185610" src="https://github.com/user-attachments/assets/cede15ba-5f8c-49b6-887c-a4c1088b881d" />

---

3. Create `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bluegreen
```

<img width="947" height="284" alt="image" src="https://github.com/user-attachments/assets/b742df00-86b3-40e3-9904-14ca42188e7d" />

---

4. Start backend server
```bash
npm start
```
<img width="958" height="178" alt="Screenshot 2026-01-17 190442" src="https://github.com/user-attachments/assets/317f4339-44ee-4860-95bd-6490d244d570" />

---

<img width="560" height="178" alt="Screenshot 2026-01-17 190910" src="https://github.com/user-attachments/assets/5a4e660e-4e64-482c-87d0-36581f8f67c7" />

---

#### Frontend Setup
1. Setup Blue Frontend
```bash
cd frontend-blue
npm install
```
2. Create `.env` file:
```
PORT=3100
```
<img width="957" height="302" alt="image" src="https://github.com/user-attachments/assets/96fab540-e5c6-4b6d-ad84-4b2afed09a8c" />

---

3. Start blue frontend
```bash
npm start
```
<img width="947" height="282" alt="Screenshot 2026-01-17 195947" src="https://github.com/user-attachments/assets/4dea10ce-8920-4b5b-ae46-3ce71c6d37c2" />

---

<img width="958" height="529" alt="Screenshot 2026-01-17 191211" src="https://github.com/user-attachments/assets/64c266b9-9e24-47c3-b8b6-bace049fa7d6" />

---

3. Repeat similar steps for Green Frontend (with PORT=3200)
<img width="949" height="286" alt="image" src="https://github.com/user-attachments/assets/1f68dfe2-3307-4d01-b763-62bb71c6eb35" />

---

### 3. Dockerization

#### Build Docker Images
```bash
# Build Backend Image
cd backend
docker build -t backend:v1 .

# Build Blue Frontend Image
cd frontend-blue
docker build -t frontend-blue:v1 .

# Build Green Frontend Image
cd frontend-green
docker build -t frontend-green:v1 .
```
<img width="957" height="511" alt="Screenshot 2026-01-17 192602" src="https://github.com/user-attachments/assets/b1563d7c-259b-4f8c-8d6a-42363da630b1" />

---

<img width="947" height="282" alt="Screenshot 2026-01-17 195947" src="https://github.com/user-attachments/assets/7edfec44-99da-497a-8004-eb4112b0b55e" />

---

<img width="940" height="539" alt="Screenshot 2026-01-17 200331" src="https://github.com/user-attachments/assets/a16743ac-dbd6-4a68-84be-a7b0c1903a43" />

---

### 4. Kubernetes Deployment

#### Minikube Setup
1. Start Minikube
```bash
minikube start
```

<img width="954" height="296" alt="Screenshot 2026-01-17 201137" src="https://github.com/user-attachments/assets/fdaea467-f528-4035-b3d5-6c338e25f99b" />

---

2. Enable Required Addons
```bash
minikube addons enable metrics-server
minikube addons enable ingress
```
---

### 5. Create Kubernetes Manifest Files

#### Required Manifest Files
Create following files in `k8s/` directory:
- `backend-deployment.yaml`
- `frontend-blue-deployment.yaml`
- `frontend-green-deployment.yaml`
- `backend-service.yaml`
- `frontend-service.yaml`
- `ingress.yaml`

---

#### Service File Key Concepts
Your `frontend-service.yaml` should:
- Use selector to route traffic
- Define version (blue/green)
- Map ports correctly

---

### 6. Deploy to Minikube
```bash
# Apply all manifests
kubectl apply -f k8s/

# Verify deployments
kubectl get deployments
kubectl get services
kubectl get pods
```
---

### 7. Blue-Green Switching

#### Switch Traffic Methods

1. Basic Patch Command

## Switch to Green
```bash
kubectl patch svc frontend-service --type=merge --patch-file patch-green.yaml
service/frontend-service patched
```

<img width="953" height="501" alt="Screenshot 2026-01-18 190143" src="https://github.com/user-attachments/assets/4f060ea0-8a22-4bf5-a9b9-4935c702b1b4" />

---

## Switch back to Blue
```bash
kubectl patch svc frontend-service --type=merge --patch-file patch-blue.yaml
service/frontend-service patched
```

<img width="956" height="517" alt="Screenshot 2026-01-18 190300" src="https://github.com/user-attachments/assets/40bbbab3-ca3c-4ef5-953e-4c4474be5770" />

---

2. Detailed Patch files
```bash
spec:
  selector:
    app: frontend
    version: green
```
---

```bash
spec:
  selector:
    app: frontend
    version: blue
```
---

### 8. Verification
- Check service endpoints
- Verify traffic routing
- Monitor application logs
---
### Troubleshooting
- `kubectl get pods` - Check pod status
- `kubectl logs <pod-name>` - View logs
- `kubectl describe service frontend-service` - Service details
---
### Cleanup
```bash
# Remove deployments
kubectl delete -f k8s/

# Stop Minikube
minikube stop
```
---
## Blue-Green Deployment Flow Chart

```mermaid
graph TD
    A[Blue Environment Running] -->|Deploy Green| B[Green Environment Prepared]
    B -->|Validate Green| C{Green Ready?}
    C -->|Yes| D[Update Service Selector]
    C -->|No| B
    D -->|Redirect Traffic| E[Green Now Active]
    E -->|Rollback Option| A
```
---
### Flow Explanation
1. Blue environment is initial production
2. Green environment deployed alongside
3. Validate green environment 
4. Update service selector
5. Redirect traffic to green
6. Blue remains as rollback option

## Best Practices
- Implement health checks
- Use resource limits
- Configure monitoring
- Validate before switching
- Maintain rollback strategy


## License
This project is licensed under the MIT License

### Author
```
Rajesh Pawar
DevOps Engineer
```
