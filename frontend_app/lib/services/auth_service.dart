import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static final Dio _dio = Dio(BaseOptions(baseUrl: 'http://YOUR_IP:5000/api'));
  static const _storage = FlutterSecureStorage();

  static Future<bool> register(String email, String password, String username) async {
    try {
      final res = await _dio.post('/auth/register', data: {
        "email": email,
        "password": password,
        "username": username,
      });

      if (res.statusCode == 200) {
        final token = res.data['token'];
        await _storage.write(key: 'token', value: token);
        return true;
      }
      return false;
    } catch (e) {
      print("Register error: $e");
      return false;
    }
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: 'token');
  }
}
