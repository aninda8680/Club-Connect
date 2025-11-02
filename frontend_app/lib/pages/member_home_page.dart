// lib/pages/member_home_page.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'login_page.dart';

class MemberHomePage extends StatelessWidget {
  const MemberHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Home"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await auth.logout();
              //go back to login page
              if (context.mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginPage()),
                  (route) => false,
                );
              }
            },
          ),
        ],
      ),
      body: Center(
        child: user == null
            ? const Text("Loading user...")
            : Text(
                "👋 Welcome, ${user.username}!",
                style: const TextStyle(fontSize: 22),
              ),
      ),
    );
  }
}
