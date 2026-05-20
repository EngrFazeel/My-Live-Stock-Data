## 🔍 **Network Error Debugging Guide**

### **Quick Checklist**

- [ ] **Backend Server Running?**
  - Check if Django is running: `python manage.py runserver 0.0.0.0:8000`
  - Should show: `Starting development server at http://0.0.0.0:8000/`

- [ ] **Correct API URL?**
  - Android Emulator: `http://10.0.2.2:8000/api/`
  - Physical Device: `http://192.168.x.x:8000/api/`
  - Web/Expo: `http://localhost:8000/api/`

- [ ] **Port Correct?**
  - Default port: 8000
  - Make sure no other app is using port 8000

- [ ] **Network Connection?**
  - Device/Emulator has internet access
  - Same WiFi network (for physical device)

---

## 🧪 **Testing Your API Endpoint**

### **Step 1: Test API with Postman or Browser**

Open in Postman or Browser:
```
http://10.0.2.2:8000/api/auth/signup/
```

You should get a 405 (Method Not Allowed) or 400 error, NOT a "Connection Refused" error.

### **Step 2: Check Response Format**

Your backend should return JSON like:
```json
{
  "access": "token...",
  "refresh": "token...",
  "user": {
    "id": 1,
    "full_name": "John",
    "email": "test@example.com"
  }
}
```

---

## 🔧 **Common Issues & Fixes**

### **Issue 1: "Connection Refused"**

**Cause:** Backend server not running

**Fix:**
```bash
# Go to your Django project directory
cd your-django-project

# Run Django server
python manage.py runserver 0.0.0.0:8000
```

---

### **Issue 2: "Network Timeout"**

**Cause:** Wrong IP or port

**Fix:** 
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Example output:
# IPv4 Address: 192.168.1.100
# Update BaseUrl.js: http://192.168.1.100:8000/api/
```

---

### **Issue 3: "ERR_INTERNET_DISCONNECTED"**

**Cause:** Emulator/Device not connected to network

**Fix:**
- For Android Emulator: Go to Settings > Connectivity > check WiFi
- For Physical Device: Connect to same WiFi as backend server

---

### **Issue 4: "400 Bad Request"**

**Cause:** Wrong form data format

**Fix:** Check if FormData is being sent correctly:
```javascript
// CORRECT
const formData = new FormData();
formData.append('email', 'test@example.com');
dispatch(signupUser(formData));

// WRONG
dispatch(signupUser({email: 'test@example.com'})); // Plain object without password fields
```

---

### **Issue 5: "403 Forbidden" or "CORS Error"**

**Cause:** Backend CORS not configured

**Fix:** Add to Django settings.py:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://10.0.2.2:8000",
    "http://192.168.1.100:8000",
]
```

---

## 📋 **Form Data Validation**

Make sure you're sending ALL required fields:

```javascript
// Required fields for signup
{
  full_name: "John Doe",        // ✅ Required
  email: "john@example.com",    // ✅ Required
  phone_number: "03001234567",  // ✅ Required
  cnic_no: "12345-1234567-1",   // ✅ Required
  address: "123 Main St",       // Optional but recommended
  role: "farmer",               // ✅ Required (farmer/breeder/trader)
  password: "SecurePass123",    // ✅ Required (min 8 chars)
  confirm_password: "SecurePass123" // ✅ Required (must match)
}
```

---

## 🐛 **Debug the Error**

Add this to your Signup screen to see the exact error:

```javascript
useEffect(() => {
  if (error) {
    console.log('🔴 ERROR:', error);
    console.log('🔴 ERROR TYPE:', typeof error);
    console.log('🔴 FULL ERROR:', JSON.stringify(error, null, 2));
    showAlert({
      title: 'Error Details',
      message: `${error}`,
      type: 'error',
    });
  }
}, [error]);
```

---

## 🚀 **Step-by-Step Setup Guide**

### **Step 1: Start Backend Server**
```bash
# Navigate to Django project
cd my-django-project

# Run server on 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000

# You should see:
# Starting development server at http://0.0.0.0:8000/
```

### **Step 2: Find Your Machine IP (for Physical Device)**
```powershell
ipconfig

# Look for IPv4 Address
# Example: 192.168.1.100
```

### **Step 3: Update BaseUrl.js**

**For Android Emulator:**
```javascript
export const BASE_URL = 'http://10.0.2.2:8000/api/';
```

**For Physical Device (replace with your IP):**
```javascript
export const BASE_URL = 'http://192.168.1.100:8000/api/';
```

### **Step 4: Test Signup**
1. Click Signup button
2. Fill all fields:
   - Full Name: John Doe
   - Email: test@example.com
   - Phone: 03001234567
   - CNIC: 12345-1234567-1
   - Address: Test Address
   - Role: Farmer
   - Password: Test@1234
   - Confirm: Test@1234
3. Click SignUp button

### **Step 5: Check Console for Error**
```javascript
// Your API response will show in console
console.log('Response:', response);
```

---

## ✅ **Successful Response Indicators**

You'll know it's working when you see:
- ✅ Green "Success" alert
- ✅ Navigates to Home screen
- ✅ Access token stored in Redux
- ✅ User profile populated

---

## 📞 **Still Having Issues?**

Tell me:
1. **What platform are you testing on?**
   - Android Emulator
   - Physical Device
   - Web

2. **What's the exact error message?**
   - "Connection Refused"
   - "Network Timeout"
   - "400 Bad Request"
   - Other: ________

3. **Is your backend running?**
   - Yes / No

4. **What's your API URL?**
   - Current: ________

5. **API Response in Postman**
   - Copy paste what you get: ________

Share these details and I can provide a more specific solution!

---

## 🎯 **Most Common Fix**

**99% of the time, it's one of these:**

1. **Backend not running** → `python manage.py runserver 0.0.0.0:8000`
2. **Wrong IP for device** → Use actual IP, not localhost
3. **Missing form fields** → Fill ALL required fields
4. **Port mismatch** → `8000` is default, verify it's running on 8000

---

Generated: May 20, 2026
Last Updated: May 20, 2026
