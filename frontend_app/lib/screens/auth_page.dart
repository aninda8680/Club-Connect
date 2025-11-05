import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'member_page.dart';
import 'profile_completion_page.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage>
    with SingleTickerProviderStateMixin {
  bool isLogin = true;
  bool isLoading = false;

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
  }

  void toggleForm() {
    setState(() {
      isLogin = !isLogin;
      isLogin ? _controller.reverse() : _controller.forward();
    });
  }

Future<void> handleAuth() async {
  setState(() => isLoading = true);
  Map<String, dynamic>? response;

  if (isLogin) {
    response = await ApiService.login(
      emailController.text.trim(),
      passwordController.text.trim(),
    );
  } else {
    response = await ApiService.register(
      nameController.text.trim(),
      emailController.text.trim(),
      passwordController.text.trim(),
    );
  }

  setState(() => isLoading = false);

  if (isLogin) {
    // 🔹 LOGIN FLOW
    if (response != null && response["token"] != null) {
      final bool isProfileComplete = response["isProfileComplete"] ?? false;
      final String? redirectPath = response["redirectPath"];

      if (!isProfileComplete || redirectPath == "/complete-profile") {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const ProfileCompletionPage()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const MemberPage()),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Invalid credentials")),
      );
    }
  } else {
    // 🔹 REGISTRATION FLOW
    if (response != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Registration successful! Please log in.")),
      );

      // Smoothly switch back to login mode
      setState(() {
        isLogin = true;
        _controller.reverse();
      });

      // Optional: Clear fields for better UX
      emailController.clear();
      passwordController.clear();
      nameController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Registration failed. Try again.")),
      );
    }
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.black,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Club Connect",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 40),

                // Animated crossfade between login and register fields
                SizeTransition(
                  sizeFactor: _animation,
                  axisAlignment: -1,
                  child: !isLogin
                      ? Column(
                          children: [
                            TextField(
                              controller: nameController,
                              decoration: const InputDecoration(
                                hintText: "Full Name",
                                filled: true,
                                fillColor: Colors.white10,
                                hintStyle: TextStyle(color: Colors.white54),
                                border: OutlineInputBorder(),
                              ),
                              style: const TextStyle(color: Colors.white),
                            ),
                            const SizedBox(height: 16),
                          ],
                        )
                      : const SizedBox(),
                ),

                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    hintText: "Email",
                    filled: true,
                    fillColor: Colors.white10,
                    hintStyle: TextStyle(color: Colors.white54),
                    border: OutlineInputBorder(),
                  ),
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: passwordController,
                  decoration: const InputDecoration(
                    hintText: "Password",
                    filled: true,
                    fillColor: Colors.white10,
                    hintStyle: TextStyle(color: Colors.white54),
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                  style: const TextStyle(color: Colors.white),
                ),

                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: isLoading ? null : handleAuth,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 50,
                      vertical: 12,
                    ),
                  ),
                  child: isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          isLogin ? "Login" : "Register",
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.white,
                          ),
                        ),
                ),

                const SizedBox(height: 16),
                TextButton(
                  onPressed: toggleForm,
                  child: Text(
                    isLogin
                        ? "Don’t have an account? Register"
                        : "Already have an account? Login",
                    style: const TextStyle(color: Colors.white70),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }

