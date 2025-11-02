import 'dart:io';

void main() async {
  final libDir = Directory('lib');

  if (!await libDir.exists()) {
    print('❌ lib/ folder not found.');
    return;
  }

  await for (final entity in libDir.list(recursive: true)) {
    if (entity is File) {
      final path = entity.path;

      // Keep main.dart only
      if (path.endsWith('main.dart')) {
        print('✅ Keeping: $path');
        continue;
      }

      // Delete all other files
      try {
        await entity.delete();
        print('🗑️ Deleted: $path');
      } catch (e) {
        print('⚠️ Failed to delete $path: $e');
      }
    }
  }

  print('\n✨ Cleanup complete! Only main.dart remains in lib/.');
}
