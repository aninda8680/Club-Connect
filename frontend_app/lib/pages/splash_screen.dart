// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import 'login_page.dart';
// import 'profile_completion_screen.dart';
// import 'member_home_page.dart';

// class SplashScreen extends StatefulWidget {
//   const SplashScreen({super.key});

//   @override
//   State<SplashScreen> createState() => _SplashScreenState();
// }

// class _SplashScreenState extends State<SplashScreen> {
//   @override
//   void initState() {
//     super.initState();
//     loadUser();
//   }

//   void loadUser() async {
//     final auth = Provider.of<AuthProvider>(context, listen: false);
//     await auth.loadUser();
//     final user = auth.user;

//     Future.delayed(const Duration(seconds: 1), () {
//       if (user == null) {
//         Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
//       } else if (!user.isProfileComplete) {
//         Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const ProfileCompletionScreen()));
//       } else if (user.role == 'member') {
//         Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const MemberHomeScreen()));
//       } else {
//         Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
//       }
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return const Scaffold(body: Center(child: CircularProgressIndicator()));
//   }
// }
