#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cctype>
#include <cstring>

using namespace std;

// General error reporting function
void reportError(const string& message, int line, const string& tokenValue = "") {
    cout << "Error at line " << line << ": " << message;
    if (!tokenValue.empty()) cout << " (token: '" << tokenValue << "')";
    cout << endl;
}

// Token types and scanner
enum TokenType {
    KEYWORD, IDENTIFIER, OPERATOR, INTEGER, REAL, STRING, UNDEFINED, END_OF_FILE
};

struct Token {
    TokenType type;
    string value;
    int line;
    Token(TokenType t = END_OF_FILE, const string& v = "", int l = 1) : type(t), value(v), line(l) {}
};

bool isLetter(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

bool isDigit(char c) {
    return (c >= '0' && c <= '9');
}

bool isAlnum(char c) {
    return isLetter(c) || isDigit(c);
}

bool isSpace(char c) {
    return (c == ' ' || c == '\t' || c == '\n' || c == '\r');
}

bool isKeyword(const string& word) {
    string keywords[] = {
        "start", "print", "input", "when", "else", "repeat", "loop",
        "match", "choice", "standard", "leave", "func", "return",
        "num", "real", "text", "flag", "lock", "true", "false", "void",
        "each", "in"
    };
    for (auto& kw : keywords) if (word == kw) return true;
    return false;
}

vector<Token> scanCode(const string& code) {
    vector<Token> tokens;
    int i = 0;
    int currentLine = 1;
    while (i < (int)code.length()) {
        char c = code[i];
        if (isspace((unsigned char)c)) {
            if (c == '\n') currentLine++;
            i++; continue;
        }

        // Comments single-line starting with @ (one @) and block with @@ ... @@
        if (c == '@' && (i + 1 >= (int)code.size() || code[i + 1] != '@')) {
            while (i < (int)code.size() && code[i] != '\n') i++;
            continue;
        }
        if (c == '@' && i + 1 < (int)code.size() && code[i + 1] == '@') {
            i += 2;
            while (i + 1 < (int)code.size() && !(code[i] == '@' && code[i + 1] == '@')) i++;
            if (i + 1 < (int)code.size()) i += 2;
            continue;
        }

        // Strings
        if (c == '"') {
            string value = "\"";
            i++;
            while (i < (int)code.size() && code[i] != '"') {
                // handle escaped quote \" optionally (simple)
                if (code[i] == '\\' && i + 1 < (int)code.size()) {
                    value += code[i];
                    value += code[i+1];
                    i += 2;
                } else {
                    value += code[i++];
                }
            }
            if (i < (int)code.size() && code[i] == '"') value += code[i++];
            tokens.emplace_back(STRING, value, currentLine);
            continue;
        }

        // Keywords or Identifiers
        if (isalpha((unsigned char)c) || c == '_') {
            string value = "";
            while (i < (int)code.size() && (isalnum((unsigned char)code[i]) || code[i] == '_')) value += code[i++];
            if (isKeyword(value)) {
                tokens.emplace_back(KEYWORD, value, currentLine);
            } else if (!value.empty() && value[0] == '_') {
                tokens.emplace_back(IDENTIFIER, value, currentLine);
            } else {
                reportError("Invalid identifier '" + value + "'. Identifiers must start with '_'.", currentLine);
                tokens.emplace_back(UNDEFINED, value, currentLine);
            }
            continue;
        }

        // Numbers
        if (isdigit((unsigned char)c)) {
            string value = "";
            int dotCount = 0;
            while (i < (int)code.size() && (isdigit((unsigned char)code[i]) || code[i] == '.')) {
                if (code[i] == '.') dotCount++;
                value += code[i++];
            }
            if (dotCount == 0) tokens.emplace_back(INTEGER, value, currentLine);
            else if (dotCount == 1) tokens.emplace_back(REAL, value, currentLine);
            else tokens.emplace_back(UNDEFINED, value, currentLine);
            continue;
        }

        // Operators and punctuation (take care of multi-char tokens)
        string op(1, c);
        // multi-char ops to recognize: == != <= >= && || .. -> 
        if (i + 1 < (int)code.size()) {
            string two = op + code[i + 1];
            if (two == "==" || two == "!=" || two == "<=" || two == ">=" ||
                two == "&&" || two == "||" || two == ".." || two == "->") {
                op = two;
                i += 2;
                tokens.emplace_back(OPERATOR, op, currentLine);
                continue;
            }
        }
        // single char operators/punct
        if (string("+-*/<>=!{}()[].,:;#").find(c) != string::npos) {
            tokens.emplace_back(OPERATOR, op, currentLine);
            i++;
            continue;
        }

        // If unknown, mark as UNDEFINED token
        reportError("Unknown character: '" + string(1, c) + "'", currentLine);
        tokens.emplace_back(UNDEFINED, string(1, c), currentLine);
        i++;
    }
    tokens.emplace_back(END_OF_FILE, "", currentLine);
    return tokens;
}

// ------------------ AST classes (no smart pointers; raw pointers) ------------------

class ASTNode {
public:
    virtual ~ASTNode() {}
    virtual void print(int indent = 0) const = 0;
};

// helper for indentation
static string indentStr(int n) { return string(n, ' '); }

// Program node
class Program : public ASTNode {
public:
    vector<ASTNode*> statements;
    Program() {}
    ~Program() {
        for (ASTNode* p : statements) delete p;
    }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "Program" << endl;
        for (ASTNode* stmt : statements) stmt->print(indent + 2);
    }
};

// Statements / Expressions base
class Statement : public ASTNode {};
class Expression : public ASTNode {};

class LiteralExpr : public Expression {};

template<typename T>
class TypedLiteralExpr : public LiteralExpr {
public:
    T value;
    string typeName;
    TypedLiteralExpr(T v, const string& tn) : value(v), typeName(tn) {}
    void print(int indent = 0) const override {
        cout << indentStr(indent) << typeName << ": " << value << endl;
    }
};

template<>
class TypedLiteralExpr<bool> : public LiteralExpr {
public:
    bool value;
    TypedLiteralExpr(bool v) : value(v) {}
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "Boolean: " << (value ? "true" : "false") << endl;
    }
};

class IdentifierExpr : public TypedLiteralExpr<string> {
public:
    IdentifierExpr(const string& n) : TypedLiteralExpr<string>(n, "Identifier") {}
};

class IntegerExpr : public TypedLiteralExpr<int> {
public:
    IntegerExpr(int v) : TypedLiteralExpr<int>(v, "Integer") {}
};

class RealExpr : public TypedLiteralExpr<double> {
public:
    RealExpr(double v) : TypedLiteralExpr<double>(v, "Real") {}
};

class StringExpr : public TypedLiteralExpr<string> {
public:
    StringExpr(const string& v) : TypedLiteralExpr<string>(v, "String") {}
};

class BooleanExpr : public TypedLiteralExpr<bool> {
public:
    BooleanExpr(bool v) : TypedLiteralExpr<bool>(v) {}
};

// Binary expression
class BinaryExpr : public Expression {
public:
    Expression* left;
    string op;
    Expression* right;
    BinaryExpr(Expression* l, const string& o, Expression* r) : left(l), op(o), right(r) {}
    ~BinaryExpr() { delete left; delete right; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "BinaryExpr: " << op << endl;
        if (left) left->print(indent + 2);
        if (right) right->print(indent + 2);
    }
};

// Range expression
class RangeExpr : public Expression {
public:
    Expression* start;
    Expression* end;
    RangeExpr(Expression* s, Expression* e) : start(s), end(e) {}
    ~RangeExpr() { delete start; delete end; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "RangeExpr" << endl;
        if (start) start->print(indent + 2);
        if (end) end->print(indent + 2);
    }
};

// For loop
class ForLoop : public Statement {
public:
    string var;
    Expression* range;
    vector<ASTNode*> body;
    ForLoop(const string& v, Expression* r) : var(v), range(r) {}
    ~ForLoop() {
        delete range;
        for (ASTNode* n : body) delete n;
    }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "ForLoop: " << var << endl;
        if (range) range->print(indent + 2);
        cout << indentStr(indent + 2) << "Body:" << endl;
        for (ASTNode* s : body) s->print(indent + 4);
    }
};

// Repeat (while)
class RepeatStmt : public Statement {
public:
    Expression* condition;
    vector<ASTNode*> body;
    RepeatStmt(Expression* c) : condition(c) {}
    ~RepeatStmt() { delete condition; for (ASTNode* s : body) delete s; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "RepeatStmt" << endl;
        if (condition) condition->print(indent + 2);
        cout << indentStr(indent + 2) << "Body:" << endl;
        for (ASTNode* s : body) s->print(indent + 4);
    }
};

// When / If
class WhenStmt : public Statement {
public:
    Expression* condition;
    vector<ASTNode*> thenBranch;
    vector<ASTNode*> elseBranch;
    WhenStmt(Expression* c) : condition(c) {}
    ~WhenStmt() { delete condition; for (ASTNode* s : thenBranch) delete s; for (ASTNode* s : elseBranch) delete s; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "WhenStmt" << endl;
        if (condition) condition->print(indent + 2);
        cout << indentStr(indent + 2) << "Then:" << endl;
        for (ASTNode* s : thenBranch) s->print(indent + 4);
        if (!elseBranch.empty()) {
            cout << indentStr(indent + 2) << "Else:" << endl;
            for (ASTNode* s : elseBranch) s->print(indent + 4);
        }
    }
};

// Switch / Match
class SwitchStmt : public Statement {
public:
    Expression* expr;
    vector<pair<Expression*, vector<ASTNode*>>> choices;
    vector<ASTNode*> defaultChoice;
    SwitchStmt(Expression* e) : expr(e) {}
    ~SwitchStmt() {
        delete expr;
        for (auto &p : choices) {
            delete p.first;
            for (ASTNode* n : p.second) delete n;
        }
        for (ASTNode* n : defaultChoice) delete n;
    }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "SwitchStmt" << endl;
        if (expr) expr->print(indent + 2);
        for (const auto &p : choices) {
            cout << indentStr(indent + 2) << "Choice:" << endl;
            if (p.first) p.first->print(indent + 4);
            for (ASTNode* n : p.second) n->print(indent + 6);
        }
        if (!defaultChoice.empty()) {
            cout << indentStr(indent + 2) << "Default:" << endl;
            for (ASTNode* n : defaultChoice) n->print(indent + 4);
        }
    }
};

// Input statement
class InputStmt : public Statement {
public:
    string var;
    InputStmt(const string& v) : var(v) {}
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "InputStmt: " << var << endl;
    }
};

// Print statement
class PrintStmt : public Statement {
public:
    Expression* expr;
    PrintStmt(Expression* e) : expr(e) {}
    ~PrintStmt() { delete expr; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "PrintStmt" << endl;
        if (expr) expr->print(indent + 2);
    }
};

// Return statement
class ReturnStmt : public Statement {
public:
    Expression* expr;
    ReturnStmt(Expression* e) : expr(e) {}
    ~ReturnStmt() { delete expr; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "ReturnStmt" << endl;
        if (expr) expr->print(indent + 2);
    }
};

// Assignment
class AssignStmt : public Statement {
public:
    string var;
    Expression* expr;
    AssignStmt(const string& v, Expression* e) : var(v), expr(e) {}
    ~AssignStmt() { delete expr; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "AssignStmt: " << var << endl;
        if (expr) expr->print(indent + 2);
    }
};

// Function
class FunctionDecl : public Statement {
public:
    string name;
    string returnType; // e.g., num, real, text, flag, void
    vector<ASTNode*> body;
    FunctionDecl(const string& n, const string& rt) : name(n), returnType(rt) {}
    ~FunctionDecl() { for (ASTNode* n : body) delete n; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "Function: " << name << " -> " << returnType << endl;
        cout << indentStr(indent + 2) << "Body:" << endl;
        for (ASTNode* s : body) s->print(indent + 4);
    }
};

// Array declaration
class ArrayDecl : public Statement {
public:
    string type;
    string name;
    vector<Expression*> dimensions;
    vector<Expression*> initList;
    ArrayDecl(const string& t, const string& n) : type(t), name(n) {}
    ~ArrayDecl() { for (Expression* e : dimensions) delete e; for (Expression* e : initList) delete e; }
    void print(int indent = 0) const override {
        cout << indentStr(indent) << "ArrayDecl: " << type << " " << name << endl;
        if (!dimensions.empty()) {
            cout << indentStr(indent + 2) << "Dimensions:" << endl;
            for (Expression* d : dimensions) d->print(indent + 4);
        }
        if (!initList.empty()) {
            cout << indentStr(indent + 2) << "InitList:" << endl;
            for (Expression* v : initList) v->print(indent + 4);
        }
    }
};

// ------------------ Parser ------------------

class Parser {
public:
    vector<Token> tokens;
    size_t current;

    Parser(const vector<Token>& t) : tokens(t), current(0) {}

    bool isAtEnd() { return current >= tokens.size() || tokens[current].type == END_OF_FILE; }

    Token peek() { return isAtEnd() ? Token(END_OF_FILE, "") : tokens[current]; }

    Token advance() { return isAtEnd() ? Token(END_OF_FILE, "") : tokens[current++]; }

    bool check(TokenType type) {
        if (isAtEnd()) return false;
        return peek().type == type;
    }

    bool match(TokenType type) {
        if (check(type)) { advance(); return true; }
        return false;
    }

    bool matchKeyword(const string& keyword) {
        if (!isAtEnd() && peek().type == KEYWORD && peek().value == keyword) {
            advance(); return true;
        }
        return false;
    }

    bool matchOperator(const string& op) {
        if (!isAtEnd() && peek().type == OPERATOR && peek().value == op) {
            advance(); return true;
        }
        return false;
    }

    // Entry point: parse Program -> Structure
    Program* parse() {
        Program* program = new Program();
        // Expect: start ( ) { StatementList }
        if (matchKeyword("start")) {
            if (matchOperator("(") && matchOperator(")") && matchOperator("{")) {
                // parse statements until '}'
                while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                    ASTNode* s = parseStatement();
                    if (s) {
                        program->statements.push_back(s);
                    } else {
                        // error: failed to parse statement
                        reportError("Failed to parse statement: unexpected token '" + peek().value + "'", peek().line);
                        // error recovery: advance token to avoid infinite loop
                        if (!isAtEnd()) advance();
                    }
                }
                if (matchOperator("}")) {
                    // ok
                } else {
                    reportError("Missing closing '}' for start block", peek().line);
                }
            } else {
                reportError("Malformed start() { ... }", peek().line);
            }
        } else {
            reportError("Expected 'start' keyword at beginning", peek().line);
        }
        return program;
    }

    ASTNode* parseStatement() {
        // Based on current token decide which statement to parse
        if (peek().type == KEYWORD) {
            string kw = peek().value;
            if (kw == "print") {
                advance();
                return parsePrintStmt();
            } else if (kw == "input") {
                // in grammar input is used as keyword on RHS of assignment; but keep parseInputStmt separate if used
                advance();
                // But grammar expects `identifier = input()` form, so this branch likely won't be used.
                return nullptr;
            } else if (kw == "when") {
                advance();
                return parseWhenStmt();
            } else if (kw == "repeat") {
                advance();
                return parseRepeatStmt();
            } else if (kw == "loop") {
                advance();
                return parseForLoop();
            } else if (kw == "match") {
                advance();
                return parseSwitchStmt();
            } else if (kw == "func") {
                advance();
                return parseFunction();
            } else if (kw == "return") {
                advance();
                return parseReturnStmt();
            } else if (kw == "num" || kw == "real" || kw == "text" || kw == "flag") {
                // array or variable declaration per grammar (Array -> DataType Name [..] = { .. } ;)
                string dtype = kw;
                advance();
                return parseArrayDecl(dtype);
            }
        }

        // Assignment: identifier = Expression ;
        if (peek().type == IDENTIFIER) {
            // lookahead for '=' operator
            if (current + 1 < tokens.size() && tokens[current + 1].type == OPERATOR && tokens[current + 1].value == "=") {
                return parseAssignStmt();
            }
        }

        // If nothing matched return nullptr
        reportError("Unexpected token: " + peek().value, peek().line);
        return nullptr;
    }

    PrintStmt* parsePrintStmt() {
        // print ( Expression ) ;
        if (matchOperator("(")) {
            Expression* expr = parseExpression();
            if (matchOperator(")") && matchOperator(";")) {
                return new PrintStmt(expr);
            } else {
                // cleanup on failure
                delete expr;
            }
        }
        return nullptr;
    }

    InputStmt* parseInputStmtFromAssign(const string& varName) {
        // expects varName already read and we found '=' 'input' '(' ')' ';'
        return new InputStmt(varName);
    }

    WhenStmt* parseWhenStmt() {
        // when ( Condition ) StatementList ElseStmt
        if (matchOperator("(")) {
            Expression* cond = parseExpression();
            if (!matchOperator(")")) { delete cond; return nullptr; }
            WhenStmt* ws = new WhenStmt(cond);
            // Then branch (statement list enclosed in { } ideally)
            if (matchOperator("{")) {
                while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                    ASTNode* s = parseStatement();
                    if (s) ws->thenBranch.push_back(s);
                    else {
                        if (!isAtEnd()) advance();
                    }
                }
                matchOperator("}");
            } else {
                // single statement form? grammar uses StatementList so assume braces required.
            }
            // optional else
            if (peek().type == KEYWORD && peek().value == "else") {
                advance();
                if (matchOperator("{")) {
                    while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                        ASTNode* s = parseStatement();
                        if (s) ws->elseBranch.push_back(s);
                        else {
                            if (!isAtEnd()) advance();
                        }
                    }
                    matchOperator("}");
                } else {
                    // single stmt else not supported by grammar; skip
                }
            }
            return ws;
        }
        return nullptr;
    }

    RepeatStmt* parseRepeatStmt() {
        // repeat ( Condition ) { StatementList }
        if (matchOperator("(")) {
            Expression* cond = parseExpression();
            if (!matchOperator(")")) { delete cond; return nullptr; }
            RepeatStmt* rs = new RepeatStmt(cond);
            if (matchOperator("{")) {
                while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                    ASTNode* s = parseStatement();
                    if (s) rs->body.push_back(s);
                    else {
                        if (!isAtEnd()) advance();
                    }
                }
                matchOperator("}");
            }
            return rs;
        }
        return nullptr;
    }

    ForLoop* parseForLoop() {
        // loop ( each identifier in Range ) { StatementList }
        if (matchOperator("(")) {
            if (peek().type == KEYWORD && peek().value == "each") {
                advance();
                if (match(IDENTIFIER)) {
                    string var = tokens[current - 1].value;
                    if (matchKeyword("in")) {
                        Expression* range = parseRange();
                        if (!range) return nullptr;
                        if (!matchOperator(")")) { delete range; return nullptr; }
                        ForLoop* fl = new ForLoop(var, range);
                        if (matchOperator("{")) {
                            while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                                ASTNode* s = parseStatement();
                                if (s) fl->body.push_back(s);
                                else {
                                    if (!isAtEnd()) advance();
                                }
                            }
                            matchOperator("}");
                        }
                        return fl;
                    }
                }
            }
        }
        return nullptr;
    }

    Expression* parseRange() {
        // Either integer..integer or Expression .. Expression
        // try integer INT .. INT
        if (peek().type == INTEGER) {
            // store start token
            Token startTok = peek();
            advance();
            if (matchOperator("..")) {
                if (peek().type == INTEGER) {
                    Token endTok = peek(); advance();
                    Expression* s = new IntegerExpr(stoi(startTok.value));
                    Expression* e = new IntegerExpr(stoi(endTok.value));
                    return new RangeExpr(s, e);
                } else {
                    // after .. not integer -> allow expression parser
                    // create left int expr and parse right expr
                    Expression* s = new IntegerExpr(stoi(startTok.value));
                    Expression* right = parseExpression();
                    if (right) return new RangeExpr(s, right);
                    delete s;
                    return nullptr;
                }
            } else {
                // no .. -> treat as simple integer expression
                return new IntegerExpr(stoi(startTok.value));
            }
        } else {
            Expression* left = parseExpression();
            if (left && matchOperator("..")) {
                Expression* right = parseExpression();
                if (right) return new RangeExpr(left, right);
                delete left;
                return nullptr;
            }
            return left;
        }
    }

    SwitchStmt* parseSwitchStmt() {
        // match ( identifier ) ChoiceList DefaultChoice leave
        if (matchOperator("(")) {
            if (match(IDENTIFIER)) {
                string id = tokens[current - 1].value;
                if (!matchOperator(")")) return nullptr;
                Expression* expr = new IdentifierExpr(id);
                SwitchStmt* ss = new SwitchStmt(expr);
                if (matchOperator("{")) {
                    // parse choice list and default until closing '}'
                    while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                        if (peek().type == KEYWORD && peek().value == "choice") {
                            advance();
                            // choice can be string, number, or expression
                            Expression* caseExpr = parseExpression();
                            // expect '->' operator to start body (in your scanned tokens '->' is OPERATOR)
                            if (matchOperator("->")) {
                                vector<ASTNode*> caseBody;
                                while (!isAtEnd() && !(peek().type == KEYWORD && (peek().value == "choice" || peek().value == "standard")) && !(peek().type == OPERATOR && peek().value == "}")) {
                                    ASTNode* s = parseStatement();
                                    if (s) caseBody.push_back(s);
                                    else {
                                        if (!isAtEnd()) advance();
                                    }
                                }
                                ss->choices.emplace_back(caseExpr, caseBody);
                            } else {
                                delete caseExpr;
                            }
                        } else if (peek().type == KEYWORD && peek().value == "standard") {
                            advance();
                            if (matchOperator("->")) {
                                while (!isAtEnd() && !(peek().type == KEYWORD && (peek().value == "choice")) && !(peek().type == OPERATOR && peek().value == "}")) {
                                    ASTNode* s = parseStatement();
                                    if (s) ss->defaultChoice.push_back(s);
                                    else {
                                        if (!isAtEnd()) advance();
                                    }
                                }
                            }
                        } else {
                            // unexpected token inside match {}: try to skip it
                            advance();
                        }
                    }
                    // try to consume '}'
                    matchOperator("}");
                    // Finally expect 'leave' keyword according to grammar
                    if (peek().type == KEYWORD && peek().value == "leave") {
                        advance();
                        // optionally semicolon? grammar shows leave then maybe tokens - keep flexible
                        return ss;
                    } else {
                        // missing leave - still return but warn
                        return ss;
                    }
                }
            }
        }
        return nullptr;
    }

    FunctionDecl* parseFunction() {
        // func Name() StatementList | func Name() ReturnType StatementList
        if (match(IDENTIFIER)) {
            string name = tokens[current - 1].value;
            if (matchOperator("(") && matchOperator(")")) {
                string returnType = "void";
                // if next token is a keyword and matches return type set
                if (peek().type == KEYWORD && (peek().value == "num" || peek().value == "real" || peek().value == "text" || peek().value == "flag" || peek().value == "void")) {
                    returnType = peek().value;
                    advance();
                }
                if (matchOperator("{")) {
                    FunctionDecl* fd = new FunctionDecl(name, returnType);
                    while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                        ASTNode* s = parseStatement();
                        if (s) fd->body.push_back(s);
                        else {
                            if (!isAtEnd()) advance();
                        }
                    }
                    matchOperator("}");
                    return fd;
                }
            }
        }
        return nullptr;
    }

    ReturnStmt* parseReturnStmt() {
        // 'return' Expression? ;
        Expression* expr = nullptr;
        // if next token is ';' it is bare return
        if (peek().type != OPERATOR || peek().value != ";") {
            expr = parseExpression();
        }
        if (matchOperator(";")) {
            return new ReturnStmt(expr);
        }
        delete expr;
        return nullptr;
    }

    AssignStmt* parseAssignStmt() {
        // identifier = Expression ;
        if (match(IDENTIFIER)) {
            string var = tokens[current - 1].value;
            if (matchOperator("=")) {
                // if input() form: input ( )
                if (peek().type == KEYWORD && peek().value == "input") {
                    // consume input ( ) ;
                    advance();
                    if (matchOperator("(") && matchOperator(")")) {
                        if (matchOperator(";")) {
                            // assignment to input: produce InputStmt or AssignStmt with input? grammar says InputStmt -> identifier = input();
                            return new AssignStmt(var, new IdentifierExpr("input()")); // keep representation simple
                        } else {
                            // error
                        }
                    }
                }
                Expression* expr = parseExpression();
                if (matchOperator(";")) {
                    return new AssignStmt(var, expr);
                }
                delete expr;
            }
        }
        return nullptr;
    }

    ArrayDecl* parseArrayDecl(const string& type) {
        // DataType Name [ Expression ( , Expression )* ] = { ExpressionList } ;
        if (match(IDENTIFIER)) {
            string name = tokens[current - 1].value;
            ArrayDecl* arr = new ArrayDecl(type, name);
            if (matchOperator("[")) {
                // parse one or more expressions separated by commas until ']'
                while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "]")) {
                    Expression* d = parseExpression();
                    if (d) arr->dimensions.push_back(d);
                    if (peek().type == OPERATOR && peek().value == ",") {
                        advance();
                        continue;
                    } else break;
                }
                matchOperator("]");
            }
            if (matchOperator("=")) {
                if (matchOperator("{")) {
                    // parse init list expressions separated by commas until '}'
                    while (!isAtEnd() && !(peek().type == OPERATOR && peek().value == "}")) {
                        Expression* e = parseExpression();
                        if (e) arr->initList.push_back(e);
                        if (peek().type == OPERATOR && peek().value == ",") advance();
                        else break;
                    }
                    matchOperator("}");
                }
            }
            if (matchOperator(";")) {
                return arr;
            }
            // if missing semicolon still return (lenient)
            return arr;
        }
        return nullptr;
    }

    // Expression parsing (precedence climbing via separate functions)
    Expression* parseExpression() { return parseOrExpr(); }

    Expression* parseOrExpr() {
        Expression* left = parseAndExpr();
        while (peek().type == OPERATOR && peek().value == "||") {
            string op = peek().value; advance();
            Expression* right = parseAndExpr();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parseAndExpr() {
        Expression* left = parseEqualityExpr();
        while (peek().type == OPERATOR && peek().value == "&&") {
            string op = peek().value; advance();
            Expression* right = parseEqualityExpr();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parseEqualityExpr() {
        Expression* left = parseComparisonExpr();
        while (peek().type == OPERATOR && (peek().value == "==" || peek().value == "!=")) {
            string op = peek().value; advance();
            Expression* right = parseComparisonExpr();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parseComparisonExpr() {
        Expression* left = parseAddExpr();
        while (peek().type == OPERATOR && (peek().value == "<" || peek().value == ">" || peek().value == "<=" || peek().value == ">=")) {
            string op = peek().value; advance();
            Expression* right = parseAddExpr();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parseAddExpr() {
        Expression* left = parseMulExpr();
        while (peek().type == OPERATOR && (peek().value == "+" || peek().value == "-")) {
            string op = peek().value; advance();
            Expression* right = parseMulExpr();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parseMulExpr() {
        Expression* left = parsePrimary();
        while (peek().type == OPERATOR && (peek().value == "*" || peek().value == "/")) {
            string op = peek().value; advance();
            Expression* right = parsePrimary();
            left = new BinaryExpr(left, op, right);
        }
        return left;
    }

    Expression* parsePrimary() {
        if (peek().type == INTEGER) {
            int v = stoi(peek().value);
            advance();
            return new IntegerExpr(v);
        }
        if (peek().type == REAL) {
            double v = stod(peek().value);
            advance();
            return new RealExpr(v);
        }
        if (peek().type == STRING) {
            string s = peek().value;
            advance();
            return new StringExpr(s);
        }
        if (peek().type == IDENTIFIER) {
            string id = peek().value;
            advance();
            return new IdentifierExpr(id);
        }
        if (peek().type == KEYWORD && peek().value == "true") {
            advance();
            return new BooleanExpr(true);
        }
        if (peek().type == KEYWORD && peek().value == "false") {
            advance();
            return new BooleanExpr(false);
        }
        if (peek().type == OPERATOR && peek().value == "(") {
            advance();
            Expression* e = parseExpression();
            matchOperator(")");
            return e;
        }
        // nothing matched
        return nullptr;
    }
};

// ------------------ File reading / main ------------------

string readFile() {
    ifstream file("Test.txt");
    if (!file.is_open()) {
        cout << "Test.txt not found. Creating a new empty file...\n";
        ofstream createFile("Test.txt");
        createFile.close();
        cout << "Created Test.txt successfully.\n";
        file.open("Test.txt");
    }
    string code, line;
    while (getline(file, line)) code += line + "\n";
    file.close();
    return code;
}

int main() {
    string code = readFile();
    auto tokens = scanCode(code);
    cout << "Tokens:" << endl;
    for (const auto& t : tokens) {
        string typeName;
        switch (t.type) {
            case KEYWORD: typeName = "KEYWORD"; break;
            case IDENTIFIER: typeName = "IDENTIFIER"; break;
            case OPERATOR: typeName = "OPERATOR"; break;
            case INTEGER: typeName = "INTEGER"; break;
            case REAL: typeName = "REAL"; break;
            case STRING: typeName = "STRING"; break;
            case UNDEFINED: typeName = "UNDEFINED"; break;
            case END_OF_FILE: typeName = "END_OF_FILE"; break;
        }
        // cout << typeName << ": " << t.value << endl;
    }

    Parser parser(tokens);
    Program* ast = parser.parse();

    cout << "\nParse Tree:" << endl;
    if (ast) {
        ast->print();
        delete ast;
    } else {
        cout << "Parsing failed." << endl;
    }
    return 0;
}
