#!/usr/bin/env python3
"""
Quick fix script for common Render build issues
Run this locally to verify your setup before deploying
"""

import sys
import subprocess
import os

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    print(f"🐍 Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major == 3 and version.minor >= 11:
        print("✅ Python version is compatible with Render")
        return True
    else:
        print("❌ Python version should be 3.11+ for Render")
        return False

def check_requirements():
    """Check if requirements.txt is valid"""
    try:
        with open('requirements.txt', 'r') as f:
            content = f.read()
        
        if 'numpy' in content and 'scikit-learn' in content:
            print("✅ requirements.txt looks good")
            return True
        else:
            print("❌ requirements.txt missing key dependencies")
            return False
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def check_runtime_files():
    """Check if runtime files are present"""
    files_to_check = ['runtime.txt', '.python-version', 'Procfile']
    missing_files = []
    
    for file in files_to_check:
        if os.path.exists(file):
            print(f"✅ {file} found")
        else:
            print(f"❌ {file} missing")
            missing_files.append(file)
    
    return len(missing_files) == 0

def main():
    print("🔧 Render Build Fix Checker")
    print("=" * 40)
    
    checks = [
        check_python_version(),
        check_requirements(),
        check_runtime_files()
    ]
    
    print("\n" + "=" * 40)
    if all(checks):
        print("🎉 All checks passed! Your setup should work on Render.")
        print("\n📝 Next steps:")
        print("1. Commit and push your changes")
        print("2. Deploy to Render")
        print("3. Monitor the build logs")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print("\n💡 Common fixes:")
        print("- Use Python 3.11.9 (update runtime.txt)")
        print("- Check requirements.txt compatibility")
        print("- Ensure all deployment files are present")

if __name__ == "__main__":
    main()
