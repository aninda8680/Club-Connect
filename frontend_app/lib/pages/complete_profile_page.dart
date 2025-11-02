// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../providers/auth_provider.dart';
// import 'member_home_page.dart';

// class ProfileCompletionPage extends StatefulWidget {
//   const ProfileCompletionPage({super.key});

//   @override
//   State<ProfileCompletionPage> createState() => _ProfileCompletionPageState();
// }

// class _ProfileCompletionPageState extends State<ProfileCompletionPage> {
//   final _formKey = GlobalKey<FormState>();
//   bool _loading = false;

//   final Map<String, TextEditingController> fields = {
//     'dob': TextEditingController(),
//     'gender': TextEditingController(),
//     'stream': TextEditingController(),
//     'phone': TextEditingController(),
//     'course': TextEditingController(),
//     'year': TextEditingController(),
//     'semester': TextEditingController(),
//   };

//   Future<void> _submit() async {
//     if (!_formKey.currentState!.validate()) return;

//     final auth = Provider.of<AuthProvider>(context, listen: false);

//     setState(() => _loading = true);
//     try {
//       await auth.updateProfile({
//         for (var e in fields.entries) e.key: e.value.text,
//       });

//       if (context.mounted) {
//         Navigator.pushAndRemoveUntil(
//           context,
//           MaterialPageRoute(builder: (_) => const MemberHomePage()),
//           (_) => false,
//         );
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context)
//           .showSnackBar(SnackBar(content: Text('Error: $e')));
//     } finally {
//       setState(() => _loading = false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Complete Profile')),
//       body: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               for (var key in fields.keys)
//                 Padding(
//                   padding: const EdgeInsets.symmetric(vertical: 6),
//                   child: TextFormField(
//                     controller: fields[key],
//                     decoration: InputDecoration(
//                       labelText: key.toUpperCase(),
//                       border: const OutlineInputBorder(),
//                     ),
//                     validator: (v) => v!.isEmpty ? 'Enter $key' : null,
//                   ),
//                 ),
//               const SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _loading ? null : _submit,
//                 child: _loading
//                     ? const SizedBox(
//                         height: 18,
//                         width: 18,
//                         child: CircularProgressIndicator(strokeWidth: 2),
//                       )
//                     : const Text('Submit'),
//               )
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
