# 🚀 Quick Reference Guide

## Redux Integration

### Dispatching Actions
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, clearAuthMessages } from '../Redux/Slices/authSlice';

export default function MyScreen() {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector(state => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ cnic_no: '12345-6789012-3', password: 'pwd' }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    // Your JSX
  );
}
```

---

## SweetAlert Usage

### 1. Success Alert
```javascript
import { showAlert } from '../Utils/SweetAlert';

showAlert({
  title: 'Success!',
  message: 'Operation completed',
  type: 'success',
  confirmText: 'OK',
});
```

### 2. Error Alert
```javascript
showAlert({
  title: 'Error',
  message: 'Something went wrong',
  type: 'error',
  confirmText: 'Try Again',
});
```

### 3. Warning Alert
```javascript
showAlert({
  title: 'Warning',
  message: 'Please check your input',
  type: 'warning',
});
```

### 4. Confirmation Dialog
```javascript
showAlert({
  title: 'Confirm',
  message: 'Are you sure?',
  type: 'confirm',
  confirmText: 'Yes',
  cancelText: 'No',
  onConfirm: () => {
    // Action if confirmed
  },
  onCancel: () => {
    // Action if cancelled
  },
});
```

---

## API Integration

### Making API Calls
```javascript
import ApiService from '../Services/ApiService';
import { ENDPOINTS } from '../Config/BaseUrl';

// GET Request
const getAnimals = async () => {
  try {
    const res = await ApiService.get(ENDPOINTS.GET_ANIMALS);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

// POST Request
const addAnimal = async (data) => {
  try {
    const res = await ApiService.post(ENDPOINTS.ADD_ANIMAL, data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

// PATCH Request (with FormData for images)
const updateProfile = async (formData) => {
  try {
    const res = await ApiService.patch(ENDPOINTS.UPDATE_PROFILE, formData);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
```

---

## FormData with Image Upload

```javascript
import { launchImageLibrary } from 'react-native-image-picker';

const handleImagePicker = (callback) => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    },
    (response) => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets[0];
        
        // Create FormData
        const formData = new FormData();
        formData.append('full_name', 'John');
        formData.append('profile_image', {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'image.jpg',
        });

        callback(formData);
      }
    }
  );
};
```

---

## Redux Async Thunk Pattern

### Available Thunks
```javascript
// Auth
dispatch(loginUser({ cnic_no, password }))
dispatch(signupUser(formData)) // FormData with image
dispatch(getProfile())
dispatch(updateProfile(formData)) // FormData with image
dispatch(changePassword({ old_password, new_password, confirm_new_password }))
dispatch(logoutUser())

// Animals
dispatch(fetchAnimals())
dispatch(addAnimal(animalData))
dispatch(updateAnimal({ id, data }))
dispatch(deleteAnimal(id))
```

### Redux Action Result Pattern
```javascript
useEffect(() => {
  if (error) {
    showAlert({
      title: 'Error',
      message: error,
      type: 'error',
    });
    dispatch(clearAuthMessages());
  }
}, [error]);

useEffect(() => {
  if (success && accessToken) {
    showAlert({
      title: 'Success!',
      message: success,
      type: 'success',
    });
    dispatch(clearAuthMessages());
    navigation.navigate('Home');
  }
}, [success, accessToken]);
```

---

## Validation Patterns

### Email Validation
```javascript
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### CNIC Validation
```javascript
const isValidCNIC = (cnic) => {
  // Format: XXXXX-XXXXXXX-X
  return /^\d{5}-\d{7}-\d{1}$/.test(cnic);
};
```

### Phone Validation
```javascript
const isValidPhone = (phone) => {
  // Pakistani phone format
  return /^(\+92|0)?3[0-9]{9}$/.test(phone.replace(/\s/g, ''));
};
```

### Password Validation
```javascript
const isPasswordStrong = (password) => {
  return password.length >= 8;
};
```

---

## Color Theme Reference

```javascript
// Primary Color
color.Secondry: '#3dac40' // Green

// Alert Colors
Success: '#3dac40' // Green
Error: '#e53935'   // Red
Warning: '#f57c00' // Orange
Confirm: '#1565c0' // Blue
```

---

## Common Patterns

### Login Screen Pattern
```javascript
const [cnic_no, setCnic] = useState('');
const [password, setPassword] = useState('');
const dispatch = useDispatch();
const { loading, error, success, accessToken } = useSelector(state => state.auth);

useEffect(() => {
  if (error) {
    showAlert({ title: 'Error', message: error, type: 'error' });
    dispatch(clearAuthMessages());
  }
}, [error]);

useEffect(() => {
  if (success && accessToken) {
    showAlert({ title: 'Success!', message: success, type: 'success' });
    dispatch(clearAuthMessages());
    navigation.navigate('Home');
  }
}, [success, accessToken]);

const handleLogin = () => {
  if (!cnic_no.trim()) {
    showAlert({ title: 'Error', message: 'CNIC required', type: 'warning' });
    return;
  }
  dispatch(loginUser({ cnic_no, password }));
};
```

---

## Debugging Tips

### Check Redux State
```javascript
// Add this in your component temporarily
useEffect(() => {
  console.log('Redux State:', useSelector(state => state.auth));
}, []);
```

### Check API Response
```javascript
// In your thunk, before returning
console.log('API Response:', res.data);
return res.data;
```

### Check FormData Content
```javascript
// Iterate through FormData entries
for (let [key, value] of formData.entries()) {
  console.log(`${key}:`, value);
}
```

---

## File Structure Reference

```
Src/
├── Config/
│   └── BaseUrl.js          (API endpoints)
├── Services/
│   └── ApiService.js       (Axios instance)
├── Redux/
│   ├── store.js            (Redux store)
│   └── Slices/
│       ├── authSlice.js    (Auth thunks)
│       └── animalSlice.js  (Animal thunks)
├── Utils/
│   └── SweetAlert.js       (Global alerts)
├── Screen/
│   ├── Login.js            (Login form)
│   ├── Signup.js           (Signup form)
│   └── Drawar/
│       └── Editprofile.js  (Profile edit)
└── Color.js                (Theme colors)
```

---

## Troubleshooting

### Issue: "Module not found"
**Solution**: 
```bash
npm install --legacy-peer-deps
react-native start --reset-cache
```

### Issue: "network request failed"
**Solution**: 
- Check API is running on correct port
- Update BaseUrl.js with correct server URL
- Check network connectivity

### Issue: "Invalid FormData"
**Solution**: 
```javascript
// Ensure FormData is created properly
const formData = new FormData();
formData.append('key', value);
// Don't stringify FormData
dispatch(updateProfile(formData)); // Not JSON.stringify(formData)
```

### Issue: "Redux state not updating"
**Solution**: 
- Check action is dispatched: `console.log('Action dispatched')`
- Check reducer is handling action: `console.log('Reducer called')`
- Check useSelector is getting correct state slice

---

## Next Steps

1. **Update API URL** in `Src/Config/BaseUrl.js`
2. **Test Login** flow with real API
3. **Test Signup** with image upload
4. **Test Profile** edit and image change
5. **Monitor Redux** state with DevTools
6. **Test Error** scenarios
7. **Deploy** to production

---

Generated: May 20, 2026
