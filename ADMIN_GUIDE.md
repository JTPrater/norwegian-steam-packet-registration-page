# 🔑 Admin Guide - Norwegian Steam Packet Company

## Admin Access Instructions

### NEW: Automatic IP-Based Admin Access

🎉 **Admin access is now automatic!** No more key combinations needed.

- **Your IP Address**: `108.77.151.214` - Admin access granted automatically
- **Localhost Testing**: `127.0.0.1`, `::1` - Admin access granted for local testing
- **For Others**: Regular user access (no admin features visible)

### How It Works:

1. **Visit the passenger list page** from your IP address
2. **Admin mode activates automatically** - No passwords or key combinations needed
3. **Red admin panel appears** at the top with exit button
4. **Delete buttons appear** next to each passenger
5. **Full admin functionality** available immediately

### Fallback Access Methods (Backup):

If the IP-based system fails, you can still use:

1. **Secret Key Combination**: Hold `Ctrl + Shift` and type `A-D-M-I-N`
2. **Admin Password**: `NorwegianSteam2025!`
3. **Alternative Keys**: 
   - `Ctrl + Alt + Delete`
   - `Ctrl + F12`
   - Click passenger count 5 times

### Security Features:

- 🔒 **Hidden by default**: No visible admin interface for regular users
- 🔒 **Secret activation**: Only accessible via key combination
- 🔒 **Password protected**: Requires correct password
- 🔒 **Confirmation dialogs**: Prevents accidental deletions
- 🔒 **Admin-only functions**: Delete operations check for admin mode

### Admin Actions:

1. **Delete a Passenger**:

   - Enter admin mode (Ctrl+Shift+ADMIN)
   - Red delete buttons appear next to each passenger
   - Click delete button → Confirmation dialog → Passenger removed
   - Changes sync in real-time across all users

2. **Exit Admin Mode**:
   - Click "Exit Admin Mode" button in red admin panel
   - Or refresh the page

### For Regular Users:

- No delete buttons visible
- No admin panel visible
- Cannot access delete functions even if they try
- Clean, user-friendly interface

### To Change the Password:

1. Open `list.js` file
2. Find: `const correctPassword = "NorwegianSteam2025!";`
3. Change to your preferred password
4. Upload the updated file to GitHub

### Troubleshooting:

- **Key combo not working**: Make sure to hold Ctrl+Shift first, then type A-D-M-I-N
- **Password not working**: Check for typos, password is case-sensitive
- **Delete not working**: Make sure you're in admin mode (red panel visible)

---

**Remember**: Only you know the secret key combination and password!
Regular visitors will never see any admin functionality.
