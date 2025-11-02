// import 'package:flutter/material.dart';
// import '../services/auth_service.dart';
// import 'complete_profile_page.dart';

// class RegisterPage extends StatefulWidget {
//   const RegisterPage({super.key});

//   @override
//   State<RegisterPage> createState() => _RegisterPageState();
// }

// class _RegisterPageState extends State<RegisterPage> {
//   final _auth = AuthService();
//   final _formKey = GlobalKey<FormState>();
//   final _username = TextEditingController();
//   final _email = TextEditingController();
//   final _password = TextEditingController();
//   bool _loading = false;

//   Future<void> _register() async {
//     if (!_formKey.currentState!.validate()) return;
//     setState(() => _loading = true);
//     try {
//       await _auth.registerUser(_username.text, _email.text, _password.text);
//       if (context.mounted) {
//         Navigator.pushReplacement(
//           context,
//           MaterialPageRoute(builder: (_) => const ProfileCompletionPage()),
//         );
//       }
//     } catch (e) {
//       if (context.mounted) {
//         ScaffoldMessenger.of(
//           context,
//         ).showSnackBar(SnackBar(content: Text('Registration failed: $e')));
//         setState(() => _loading = false);
//       }
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Register')),
//       body: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Form(
//           key: _formKey,
//           child: Column(
//             children: [
//               TextFormField(
//                 controller: _username,
//                 decoration: const InputDecoration(labelText: 'Username'),
//                 validator: (v) => v!.isEmpty ? 'Enter username' : null,
//               ),
//               TextFormField(
//                 controller: _email,
//                 decoration: const InputDecoration(labelText: 'Email'),
//                 validator: (v) => v!.isEmpty ? 'Enter email' : null,
//               ),
//               TextFormField(
//                 controller: _password,
//                 obscureText: true,
//                 decoration: const InputDecoration(labelText: 'Password'),
//                 validator: (v) => v!.length < 6 ? 'Min 6 chars' : null,
//               ),
//               const SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _loading ? null : _register,
//                 child: _loading
//                     ? const CircularProgressIndicator()
//                     : const Text('Register'),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
