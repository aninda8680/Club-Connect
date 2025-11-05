import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/member_page.dart';
import 'screens/auth_page.dart'; // use combined login/register page

void main() {
  runApp(const CCApp());
}

class CCApp extends StatefulWidget {
  const CCApp({super.key});

  @override
  State<CCApp> createState() => _CCAppState();
}

class _CCAppState extends State<CCApp> {
  late Future<bool> _isLoggedIn;

  @override
  void initState() {
    super.initState();
    _isLoggedIn = checkLoginStatus();
  }

  Future<bool> checkLoginStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    return token != null && token.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Club Connect",
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: FutureBuilder<bool>(
        future: _isLoggedIn,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(
              backgroundColor: Colors.black,
              body: Center(child: CircularProgressIndicator(color: Colors.blueAccent)),
            );
          }

          if (snapshot.hasError) {
            return const Scaffold(
              backgroundColor: Colors.black,
              body: Center(
                child: Text("Something went wrong", style: TextStyle(color: Colors.white)),
              ),
            );
          }

          final loggedIn = snapshot.data ?? false;
          return loggedIn ? const MemberPage() : const AuthPage();
        },
      ),
    );
  }
}
