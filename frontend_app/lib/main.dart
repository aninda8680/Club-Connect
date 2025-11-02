//main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'pages/login_page.dart';
import 'pages/member_home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..tryAutoLogin()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          if (auth.isLoading) {
            return const MaterialApp(
              home: Scaffold(
                body: Center(child: CircularProgressIndicator()),
              ),
            );
          }

          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Frontend App',
            theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
            home: auth.isLoggedIn ? const MemberHomePage() : const LoginPage(),
          );
        },
      ),
    );
  }
}
