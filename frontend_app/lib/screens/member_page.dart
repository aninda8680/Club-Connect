import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'Auth_page.dart';
import 'home_page.dart';

class MemberPage extends StatefulWidget {
  // optional named parameters so existing calls without args still work
  final String? username;
  final String? role;

  const MemberPage({super.key, this.username, this.role});

  @override
  State<MemberPage> createState() => _MemberPageState();
}

class _MemberPageState extends State<MemberPage> {
  String? username;
  String? role;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    username = widget.username;
    role = widget.role;
    if (username == null || role == null) {
      _loadProfile();
    } else {
      loading = false;
    }
  }

  Future<void> _loadProfile() async {
    setState(() => loading = true);
    final profile = await ApiService.getUserProfile();
    if (profile != null) {
      // your API returns either { user: {...} } or a flat object depending on endpoint.
      // handle both shapes gracefully:
      final userObj = profile['user'] ?? profile;
      setState(() {
        username = userObj['username']?.toString() ?? userObj['name']?.toString() ?? 'User';
        role = userObj['role']?.toString() ?? 'member';
        loading = false;
      });

      // If role is visitor, redirect to HomePage
      if (role == 'visitor') {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => HomePage(username: username ?? 'User', role: role ?? 'visitor')),
        );
      }
    } else {
      // token might be invalid — go back to login
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const AuthPage()),
        (route) => false,
      );
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const AuthPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    // While loading profile, show spinner
    if (loading) {
      return const Scaffold(
        backgroundColor: Colors.black,
        body: Center(child: CircularProgressIndicator(color: Colors.blueAccent)),
      );
    }

    // If role is visitor we already redirected in _loadProfile, but keep a fallback:
    if (role == 'visitor') {
      return HomePage(username: username ?? 'User', role: role ?? 'visitor');
    }

    // Member UI
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text("Club Connect - Member"),
        backgroundColor: Colors.deepPurpleAccent,
        actions: [
          IconButton(
            onPressed: _logout,
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          )
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.people_alt, size: 90, color: Colors.purpleAccent),
              const SizedBox(height: 20),
              Text(
                "Welcome ${username ?? 'Member'} (Member)",
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                "Access your clubs, chats and events from here.",
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: () {
                  // placeholder for navigation to clubs or dashboard
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Clubs coming soon')));
                },
                icon: const Icon(Icons.explore),
                label: const Text("Explore Clubs"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurpleAccent,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
