// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../utils/constants.dart';

class ApiService {
  static final _storage = FlutterSecureStorage();

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('$apiBaseUrl/auth/login');
    final response = await http.post(url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}));

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      await _storage.write(key: 'token', value: data['token']);
    }
    return data;
  }

  static Future<Map<String, dynamic>?> getUserProfile() async {
    final token = await _storage.read(key: 'token');
    if (token == null) return null;

    final url = Uri.parse('$apiBaseUrl/user/me');
    final response = await http.get(url, headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json'
    });

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }
}
