import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthProvider extends ChangeNotifier {
  final _storage = const FlutterSecureStorage();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;

  /// Manual login (from login page)
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    final result = await ApiService.login(email, password);
    if (result['token'] != null) {
      final profile = await ApiService.getUserProfile();
      if (profile != null) {
        _user = User.fromJson(profile['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      }
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  /// Auto-login when app opens (check if token exists)
  Future<void> tryAutoLogin() async {
    _isLoading = true;
    notifyListeners();

    final token = await _storage.read(key: 'token');
    if (token != null) {
      final profile = await ApiService.getUserProfile();
      if (profile != null) {
        _user = User.fromJson(profile['user']);
      }
    }

    _isLoading = false;
    notifyListeners();
  }

  /// Logout clears token + user data
  Future<void> logout() async {
    await _storage.delete(key: 'token');
    _user = null;
    notifyListeners();
  }
}
