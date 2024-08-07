# オンラインワークスペース「つなリズム」 
https://tsunarhythm.com <br />
登録せずにお試しいただくことができます。制作期間は約2ヶ月半です。

Qiitaはこちら→ [https://qiita.com/sawata0324](https://qiita.com/sawata0324)　<br />
はてなブログはこちら→ [https://sawata0324.hatenablog.com/](https://sawata0324.hatenablog.com/)　<br />
Wantedlyはこちら→ [https://www.wantedly.com/id/sawata_0324　](https://www.wantedly.com/id/sawata_0324)　<br />

## 目次
1. **サービス概要・制作背景**
1. **アプリケーションのイメージ**
1. **機能一覧**
1. **使用技術**
1. **画面設計図/画面遷移圖(figma)**
1. **ER図**
1. **インフラ構成図**
1. **工夫した点**
1. **IT学習・ポートフォリオ作成工程詳細**

# サービス概要・制作背景
◇サービス名 : オンラインワークスペース「つなリズム」
<br />
◇コンセプト : このサービスはフリーランスのためのオンラインワークスペースとして設計されており、自己分析ツールとSNS機能を組み合わせることで、実用的ながらもコミュニティ感を持った環境を提供します。フリーランスで働く人々が自分のワークを客観的に分析しつつ、互いに繋がり合うことを目的としています。
<br />
◇ペルソナ : フリーランスの動画編集者やライター。プロジェクト管理や自己分析に関心が高く、同じ分野の仲間との繋がりを求めている人々。
<br />
◇背景 : フリーランスはしばしば孤立しがちで、特に仕事と直接関係のない同業者との繋がりが少ない。また、案件管理や時給計算などの業務管理が煩雑であることが多い。
<br />
◇差別化した点 : 本サービスは、ただのワークスペースではなく、ユーザーの自己分析を支援し、同業者との繋がりを深めることを可能にするSNS機能を備えています。また、作業時間の追跡や時給計算を自動化し、プロジェクト管理を容易にするツールを提供します。

# アプリケーションのイメージ
![イメージ動画 4](https://github.com/user-attachments/assets/93b2b3f6-dad8-4c73-9ee5-d322630ffcbd)
### アカウント作成/ログイン後の基本的な使用フロー
#### ダッシュボードページにて自分の獲得した案件の詳細を記入します。
https://github.com/user-attachments/assets/24756487-d816-465c-bccc-010162d3762e

#### ルーム一覧からルームを選択し入室します。入室したら座席に着席しましょう。
https://github.com/user-attachments/assets/2c16a790-1c71-4296-93e6-771ac1eb5afc

#### 先ほど保存した案件名を選択して作業タイマーを起動させましょう。ブラウザは閉じてもタイマーは継続します。
https://github.com/user-attachments/assets/d315f73b-9a61-4e09-a7eb-518eee8ecd0f

#### ルームチャットでコミュニケーションもできます。
https://github.com/user-attachments/assets/5eb4e437-7837-4ce0-aaa5-55c66f6acecb

#### タイマーをストップしてみましょう。作業時間は後からでも編集できます。
https://github.com/user-attachments/assets/a3184f3b-e8b5-491f-9bee-d06d6c46c79a

#### ダッシュボードに反映されているか見にいってみましょう。案件ごとの作業時間から案件Aを選択します。
https://github.com/user-attachments/assets/9f4f585c-4046-4543-93a2-edc1709bd6b2

#### 案件が終わったら完了チェックをつけましょう。リロードすれば変更が反映され、案件ごとの時給平均や作業時間などさまざまな分析をしてくれます。
https://github.com/user-attachments/assets/93b019d8-d0e3-4558-8caa-24c98a57110a

## 機能一覧
- ユーザー機能
  - 新規登録機能
  - ログイン機能、ゲストログイン機能、ログアウト機能
  - マイページ表示機能
  - プロフィール変更機能(アイコン画像、名前、パスワード、メールアドレス、ワーク)
  - 全ユーザーの一覧表示機能およびページネイション機能
  - フォロー追加・解除機能
  - 各ユーザーのフォロー一覧、フォロワー一覧表示機能およびページネイション機能
  - ユーザー作成時の自動アイコン付与機能
- 投稿機能
  - 日記投稿、編集、削除機能
  - 全ユーザーの日記一覧機能およびページネイション機能
  - 投稿詳細機能
- ルーム内機能
  - 一意なルームへの入室・退出機能
  - リアルタイムな座席着席機能
  - リアルタイムなルームチャット機能
  - プロジェクトごとのストップウォッチを使った作業時間の記録機能
  - 各作業時間のテーブル形式でのCRUD処理
- ダッシュボード機能
  - 棒グラフでの日毎の作業時間の表示機能
  - 折れ線グラフでの日毎の平均時給の表示機能
  - 棒グラフでの日毎の稼いだ金額の表示機能
  - 棒グラフでの日毎の案件ごとの作業時間の表示機能
  - 今月の平均時給の表示機能
  - 今月の給与合計の表示機能
  - ランダム応援ひとこと機能
  - プロジェクト別時給平均ランキング機能
  - ワークの種類別の時給平均ランキング機能
  - 各プロジェクトのテーブル形式でのCRUD処理

# 使用技術
| フロントエンド
----|
| React 18 |
| Next.js 14.2.3 |
| TypeScript 5.5.3|
| axios(バックエンドとの非同期通信) |
| ESLint/Prettier(静的解析、フォーマッター) |
| TailWindCSS,shadcn/ui |
| ChartJS |
<br />

| バックエンド |
----|
| Ruby 3.3.0 |
| Rails 7.0.4.3 |
| MySQL8.0.36 |
| ActionCable |
| RuboCop(静的解析、フォーマッター) |
| RSpec(自動テスト) |
| Nginx(Webサーバー) |
| Puma(APサーバー) |

<br />

| インフラ |
----|
| Docker/docker-compose |
| AWS（ECS on Fargate,ECR,RDS,CloudFront,Route53,VPC,ACM,AIM,ElastiCache） |
| GitHub Actions(RSpec自動テスト,Rubocop静的コード解析) |
| CodeRabbit |


<br />

# 画面設計図/画面遷移圖(figma)
※アプリ作成前のイメージサイトとして作成したものなので、実際のアプリケーションと多少乖離があります。
https://www.figma.com/design/iwQ8M5fM7YT9RSUpYuNyJh/%E3%81%A4%E3%81%AA%E3%83%AA%E3%82%BA%E3%83%A0?node-id=0-1&m=dev 

# ER図
<img width="631" alt="スクリーンショット 2024-07-12 4 21 10" src="https://github.com/user-attachments/assets/186aff4e-d8ac-444a-b4e1-eb5278b628b1">

# インフラ構成図
<img width="1048" alt="スクリーンショット 2024-07-22 3 00 30" src="https://github.com/user-attachments/assets/0c2617a2-9863-4225-b285-e0015915b702">

# 工夫した点
### フロントエンド
 - Next14による完全SPA化を行い、最新のAppRouterを使った画面遷移で設計しました。
 - TypeScriptをダッシュボード機能の実装過程において導入しました。
 - レスポンシブ対応にしました。
 - ユーザー一覧ページとフォローしているユーザー一覧ページ、フォローされているユーザー一覧ページでのユーザーの表示形式を同じコンポーネントを使って作成することで保守回収がしやすい設計にしました。
 - ルームでの座席着席機能が自然と行えるようにアカウント作成時に自動でランダムにアイコンが設定されるようにしました。
 - ストップウォッチ機能でブラウザを閉じても再度開いたときには途中からスタートするように作成しました。
 - 長期間入室しているユーザーを一定期間で退室させるようにして、入室情報にバグが発生しても早期に改善されやすくなるように設計しました。
### バックエンド
 - RailsをAPIモードで使用しました。
 - ActionCableのWebSocket通信を使いチャット機能と座席着席機能をリアルタイムで通信させるように設計しました。
 - 各データ取得時に余計なデータの取得を行わないように目的に応じてメソッドを追加し、データ量が多くなる場合はページネイション機能と合わせることでデータの取得の最適化に勤めました。
 - 入室管理機能において、入室情報を管理するテーブルを作成するのではなく、入室時間と退室時間を記録するようにして、入室時間が記録されていて、かつ退室時間がnullのユーザーを入室(着席)中と表現するという方法を使うことで、入室しているユーザーデータの確認を行い、バグを起こりにくくしました。
 - posts_controller.rbにおいてpostsを取得する際、関連するuserも同時にロードするためにincludesメソッドを使用し、N+1問題を回避しました。
 - ロケールファイルを利用して、表示文言を一元管理しました。
### インフラ
 - WebSocket通信を行うためのredisをタスク定義で立ち上げるのではなくElastiCacheを使って立ち上げることで運用管理の負担を軽減しました。
 - GithubActionsを利用してCIを実現しました。
 - Code Rabbitを使用してコードの変更点から何が変更されたのかの要約を自然言語処理を使ってプルリクエスト後マージ前の段階で自動生成→確認できるようにしました。

# IT学習・ポートフォリオ作成工程詳細
※は途中までという意味です。
1. 2022/10~11:
    - キタミ式IT塾基本情報技術者検定 第17章まで
    - Linux標準教科書 ハンズオンで1冊
    - Progate修了(HTML/CSS,Git,CLI※,JavaScript/Ruby※/SQL/Python※)
    - Udemy 「GitとGithub(山浦清透)」修了
    - アルゴリズムとデータ構造※(石畑清)
2. 2023/11~12:
    - Railsチュートリアルを修了
    - ポートフォリオの企画作成
    - ポートフォリオの計画作成
    - Figmaを使った画面設計図と画面遷移図の作成
    - ER図の学習・作成
3. 2023/1:
    - 各言語とLinux・IT基礎知識の総復習
    - Githubとの接続
    - ポートフォリオの作成(基本機能のみ)
4. 2023/2~3:
    - docker-composeによる環境作成
    - リーダブルコードの読了
    - Rspecのテスト作成(75)
    - Rubocopのコード整形
    - Prettierの導入
    - ESlintの導入
    - GithubActionsによるCI設定
    - AWS
        - Udemy「AWSコンテナサービス入門 しま(5時間)」修了
        - Udemy「GithubActionsで学ぶCI/CD入門 しま(4時間)」修了
        - RDS,S3,ACM,ECR,VPSを使用してEC2によるデプロイ
        - ECSonFargateへのデプロイ
        - Codeシリーズを使ったCI/CDパイプラインを作成
        - ALBによる負荷分散
5. 2024/4:
    - Udemy「React完全入門ガイド CodeMafia(27時間)」修了
    - Udemy「TailwindCSS3.0 shincode(3.5時間)」修了
    - Next/React,Railsを使用したSPAのポートフォリオの再作成を開始(4/27~)
    - SPAでのDocker/docker-compose導入
6. 2024/5~6(ポートフォリオの再作成):
    - 基本機能の実装修了(~6/11)
    - GithubActionsでCI設計(Rubocop,Rspec)
    - アカウント作成/ログイン/ログアウト/ゲストログイン/退会
    - プロフィール編集機能
       - 名前,ワーク,パスワード,メールアドレス,プロフィール文章
    - 日記機能(CRUD処理)
    - フォローフォロワー機能
    - 各種ページネイション機能
        - フォロー一覧,フォロワー一覧,日記一覧,ユーザー一覧
8. 2024/6/11~6/26:
    - 一意なルームへの入室・退出機能
    - リアルタイムな座席着席機能
    - リアルタイムなルームチャット機能
    - プロジェクトごとのストップウォッチを使った作業時間の記録機能
    - 作業時間の追加、削除、編集機能
    - ダッシュボード機能
    - 棒グラフでの日毎の作業時間の表示機能
    - 折れ線グラフでの日毎の平均時給の表示機能
    - 棒グラフでの日毎の稼いだ金額の表示機能
    - 今月の平均時給の表示機能
    - 月の給与合計の表示機能
    - ランダム応援ひとこと機能
    - プロジェクト別時給平均ランキング機能
    - ワークの種類別の時給平均ランキング機能
    - カレンダー機能
    - 各プロジェクトのテーブル形式での追加・編集・削除機能
9. 2024/6/26~7/11:
    - ECS,ECS on Fargate,ECR,RDS,CloudFront,Route53,VPC,ElastiCacheを使用しデプロイ
10. 7/11~:
    - 軽微なバグ改善、軽微なUI/UXの改善
    - ダッシュボード機能のTypeScript化
