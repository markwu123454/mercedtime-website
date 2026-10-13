// The email header's wordmark: "MERCEDTIME" drawn in the site's Bebas Neue at 3x (466x82 px, shown at
// 155x27), white with a gold TIME on the header's navy (#0f2e53). The navy is baked in, not
// transparent, because dark-mode email apps (Gmail, Outlook) recolor the header cell but never the
// image: on a transparent PNG the white letters could land on a lightened header and vanish. It rides
// in the email as an inline attachment (cid:wordmark) instead of a link to mercedtime.com, because
// Outlook holds back linked images as "blocked content" until the reader asks for them; an attached
// one shows straight away. Inline SVG isn't an option: Gmail and Outlook drop it. To change it, draw a
// new PNG and replace this.
export const WORDMARK_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAdIAAABSCAIAAABvxcINAAAYtElEQVR42u1de5gT5b3+krkmmdw22YTdLHtjWS4Li6xyVQRBvKEo" +
  "7dGKldpqtbWC9akeT3ssVQ+FXh59qgdtraXtsTwFxHOsCoo3KBdBWeRSl6uuwN43m2RzTyZzPX+spQs7k5lJsgtJvvcvHuab7OSb" +
  "L+/85ve9v/enszZ+HUAUH8bXVtw4b9rcGZPrazwWykiSOIogA4dEUaRTTIJm2rq8B1tat2zfv7u5Bc4YBESuoPvL6x8uW7JA62kn" +
  "T3fOXPKI+vHPrfzePV+/VqfT5fyv3Hnz3Gf+87uUyTCs08Sw3HN/fmPNi5skj149ffLvV68oc5Vk/PkphmVZzh+M9PqCew8ef3tH" +
  "86FjrcP0XZZ/a/Hdt11TV11+jmfTQxRFfzCybeenv3xpc7c3kMFffPPlJ+fOmDzcSzn9aln71IMZrPPBoFMMw3K9vuCJ1vbdzUdf" +
  "fXt3LJ7U+iGlZva395ypLGFG8kceTiAP/7X6ZI/Eb+TbV/U9OL9PYXGyutVbPe+12NIPe/q2zhsaQ1qv7d3PbE++UaF+/M9u7Vw0" +
  "ZVj+ipqpyB7t/fgPXqlBMzvZYjLMaprw8aETKse7nTatnFtUIHCMwDHKZKiucM+cOv5H9y3pC4Tf33Pwxb9sOXm6M1d/ZdmSBT+6" +
  "b0l1hVvTvdDpdKUl1m99bcFt183auGXnqrUbM6CbAgBJ4CSBWyhjfY3n1oWzVj/27eOtbS9v2LZp6y64gDPGKJu2J5CTYgvgW+sz" +
  "O81AEm6nTf34EpsFrjBNTOd22pYtWfD++jW/+vG92cfylMnwwtM/ePaJ+2tGj8r4+WehjA/ceeNbf3hyWmM9vEckgTU11P3u58t3" +
  "bfr1gtmXwQnJcGWSgtXAqZ1zTLAaheKlXQLHXA6b+t+83UrBFZYx0324fs1VVzRkw7l//NUjSxfPwzEUZP08aGqoe2n1ioVXTYV3" +
  "Z2BCpkyofeWZR3+6fCmcjQxgwnmLgVc52GrkKZIDRUu7KIqop91pjfUWsxGusIx/2OPHjH55zcMZM90zP/nutVdORfT6XF3SmMqy" +
  "VY/eA2PewQ+2R+697XerlsOp0Ey7hGBVTbulFGshizjaxTFUfZLB7bBRBhKusGxQ7nY89cO7x9dWaD1x5Yq7brtudg45dwDjajxP" +
  "PHTncO9k5hFQBLl90RzIvJrfm1HBo3qD0VPCEGgR0y4AoLLcpXJkbVUZjmNwhWWJiWMr1zz+HU2nLLxq6jdvnUcS2HDE4Fde0fCT" +
  "B++A92Uw8950zbR7b78OToUG2sXEMqta2i2zMgQmFjXtlpZYVY50lVgxFIErLHumm3nZ+O/fdZP6U+6743q30z5M14OhyM3zZ8BU" +
  "w2BYzaYHlt6YwUtJMaPSweR8ZMHSLmUimxrqoHpsJGE0ELcunKVy8M3zZ1w+eeywzvzostKli+fB+zIYY6rKl31tAZwHMAyasMJQ" +
  "j2VFuwaScKlL70L1WA4xoa7y9pvmqBk5f/YUxzDPvF6vmzNtUl1VObwvg18CrptzOZwTDa8IRoHEhOJRj2VFu0aScNotUD0GRlxS" +
  "Nn3KODXTPrtpgl6vU1mHFghFPzl8ctPWXa+9s+fQsdZQJC6KqpJo5a6SeTMnw/ty/kuAc9H86XAeVEt3OauRLx71GAAgcyEnhqGV" +
  "HuVdtaaGOvMlsN/9+ZmubMpteU44cvzLLK+h19e/c/+F5gaUkZxYV1XpKVVZqqvX6xrH1ygOu/bKy1RmdWPx5B9efffZda8Prj2j" +
  "TIZHv/u1+79xg6JWwWggJtVXZ3+D6BS7fe/haCLz+rfMCpcHg+P5vZ8e7/H1D71H9TUV1RVulcJnksBnXjbuealDURrZvN9hp5Tp" +
  "4/pJoQq7wjt1IIa822KnOYWHazKF9IYv3T1tMyHYjZxX6QrtRs5MXORol+V1249Zu7KYzGAMjdJI5rSLY2hZqV1NNHQp0G5PX//3" +
  "n1h7ca8hFE3IXcOC2Zc99cjdk+qr1KRiy1z2poa69E+RSfXVJiOphux+v3HbqrUbhnLx08//VRDEh5bdkl4IodPpJtRVZj85HMdt" +
  "2b7/4hbaCoK4/x+n5Jw3pjXWr1yx9MorGtSo8cbVjq6rKm9t675wwln9awccai5mWnVckXbjDLLxE4cvmt8yIRITqpwpScuIwahy" +
  "ptTkIoZ5hYB9X1KK9hTDmGQAAHhGORXHVHlcWNbFUQWP7fuO3P/j545/0a5msM1CjakqSz+mtnKUmtDs8LHWoZx7DqvWbth/5CRQ" +
  "oWkphlTmgc8+v+uRX+9pPqom/WK3UpPGVcGFrS6AE1xm5fDfZeZwrOhzuwAAh82sOMZZYsVQSLtAjYHW+r9tTyRTQEVldu3oUdnL" +
  "+xiW2/PpsfRjdu1voVMKMZeZMtRVF8UOUiyefHH9Fl9/GChvOONVHjdc1WqgA7pRKqS7o6yMDugg7QKzyagY5jjsZpUbOxAf7j3S" +
  "6wuqEfAiSjroUhWl2/EEffyLtvRjjre2R+MJBYohcJvZVCT36IOPDh9WkeXHMaxCxbsgxADcFjYnY4qCdo1GYnR5aa6qKiBa27rP" +
  "dnmzz6pTJoNeRY6YTjH9oVj6MX3+UJJOKRp0uEvtxXObvjjTxfG84s7ncBQHFirsFKfXi2nnU1SzD1kUtEsZSLdSVFXqsMFVpR5d" +
  "vf7sPySH6pFDx1oTNKNEMXo123cFA19/hOP4nOx8QAzAYuAdpnSs6jBx6o3KCpx2cRyrTbu3c/X0yVYKeo9pgNcfYlgOzsMlfY98" +
  "QTW0m3P7oQKGleQdaYNZB8VZyWKiXY7nBUGUK8hxpc0huJ02uTgonqDlPraYIYhwTiAKEylWJ583Ez32dC9VHjuDy5jghJJIAdKu" +
  "LxBOJGkg3wQBpLUrlJMxdfT6FRNkEBAQBYP2flyOeQlEKE2rISs1cwQiSAppv/SSBUi7KYaNydAuUPJbKC2xoFJ77qIoBkNRuBAh" +
  "IIoH4QSa4vQy2wOg1Mymb/0pmbNJ8fpwQUa7KYaNRBNpZOFp6kcdNotkzSvDcv2QdiEgiglJRh+hZQnHlVYfJnc0xegCMbQAaVcE" +
  "IBiOyUt3DWnsH8vd0nWQLMv1hyHtQkAUEWhOF6NR+WqIdLQrdzSSQmhGX5hKhi6vPw3tlrtK5I7KyTmj8WQ8QcOFCAFRPOB5vS8i" +
  "S7s2EyeXZyg1szYZeVkojsZSBUq7gWBUVsyAoVUyPmSzmiZYZPIP4VgiEk/ChQgBUVTwRmRLSCwEbzPxMozMWwjpQ91BHBSqbrez" +
  "18+wrIyGDHXKaMjcTpuBJIC0OiIEl2DGYFiuR0UNMQTEpYaOfkKQcbPBUdFtltaQuc0MjkqHfR1BrGD9dru9AYblSAKXLIJ02KUN" +
  "cVwOGyHTubKzxw+XoCTsFkrReFcQhJFM0cxc8gi8LxA5gS+Kpni9QS9IBXCiU0ZD5jRzmBTtMizoDhIuC1Ow0W5MPicg57rgctgk" +
  "1WMczwdCEbgEJUEZSUXnIIblsrf0hoAAF0G6S6QY6eWNIaJTJrfrNLMYIkW7vD5N1iLvaffjQyfSpGLlXBfcTptkrQTDcO3dPrgE" +
  "gbRPbpnimFAk9mVbD5wriLxDKI5EUrIvc6NlbN3l/j9KI30RtJA9GbzyyUQrZbx6ukQ3rcpyl5wQuA/mdoG0hUWlkqMbAOBMhzeb" +
  "BkUQEBcvyYCF4rJEWS5THyz3/3EGieRhrYQG2m3v7pM7ZDKSkiXCcsmHaDzR3gWjXQncsmCGYjNmjudbTp2BcwWRp0ijPbAa+KEt" +
  "2Z0Ua5XxHgtEkXASLeQWlgPOWJJJAxxDh5ZFNDXUUSZSxqKfPnSs9YZ5V4zk9yxzlby0eoW2F6JwbN2r7w1thzVMuPf26+5YNEfR" +
  "tqo/FN01pA9mAQBF0VsWzJg3q1HTWbubj2548++Qy/IIabQHRpK3kLw/dt4AC8kbZbzHLhg5ElGqHsweE6typjSddbzT8NEXlkxo" +
  "92ynl5WhXRRFSksudGZwyavHev0XQfxUX+Opr/EAjV0v39n56QjQLmUyrFyx9JuLr1Fs0yuK4t6Dxz/46HDh/RpJAsugyTnLcpB2" +
  "8y3aJRgWSEqcDKhgp3jgv8ABnTegglT1rHjGN9ImOBgi3tCoOUH67me2DGnXH4wk6JSkiyOKII4hhjhOu8UoQ7s5cfLOR9jMxgsi" +
  "bspIjqksq65wyz2iht6F/9u2F/50IUA+V0wwvF6yGSWOCEM797gtLC7lPcaw+r5ovjZpVHvdrWe7o7GkXLp2aJKhUqZhcDFL/UeV" +
  "ltx589yMT6dT7F9e3751x37404XIX/RF0CiNUKQU7WJgqAjXZWEkQ2Oa1bf5CVDY3SVa27rTtDIc6r1QVmqXUY+xp6H4STt4QXjj" +
  "/X1pmqtDQOQFIkkkzsjKD2qcjOL/DCBMI/noPaa5qU8aib7FZJjVNAGoaCQVS9JeqB4DmquBN76187FfrINTAZHvCCfRQFSWdkfZ" +
  "GMX/OUffgXihJxkAAF5/SBRFnVRLWgNJXKAhc9ikK4Yj0cSBzz6Hi08lRFHs6PE9/+c3/7j5PTgbEIWBNAoEihSsBu6cLMxq4CTT" +
  "EQNCNEHQgYKn3b7+MMvxkqkDAsdcg2rV6qrKzSbpzpXBcCwGvcfUQRDErTv2/+w36892euFsQBQM2gOy0l0TzlsM/DnatRh4E87L" +
  "5IgxUAydg0+39TAMKyO6RAbT7ujyUqOR0GrdCzHUZmjxtTM/2vzM79c8LGcYDwGRd+gJyzZVMxHC4OIIq4E3ERLRLsvrOvrxoqDd" +
  "7r7+qEygimPo4CSD22GjDKRk+BYIwqYSQKuq9xuLrt6y7qmFV02FswFRAGjzEzQrzTwEKnhK/pXM9ZQwhJRol+V0/rxVj2mj3UPH" +
  "WqPy+YHBDgy1VWW4lOiDYdnOXhjtZoIxlWXP/+z7kHkhCgDBBBqVaQlBYGKZ9V+0W2ZlCKk+7XFWn6cG55ppNxZPeuULzAZLel0l" +
  "VgxFoGNhblHudjz58DfrqsrhVECAPHfdDSVkY9VKByP578FI0EiERvJ3BrQF6r7+sPy7MNnUUDfgjOV22iQFD/EE7fVfHPXYrv0t" +
  "tz7wdL6v13FjRn/n9oVPPPNK4f0UY/HkY2vWbdq6C7ISKPy9Yl1QXnI72A1nqDMO+EqFhoy8IQMAIMXqVm/1vNdiG7loFwDQ7Q1w" +
  "vPTGooEkzrlnlQypFT7XQm13cwtcdhkDQ5Hr5lwOA16IfEdbQLbAzGoUSEwAAJCYYDUKhdRCLeNoN8JxvGTXGSNJOO2WgS0gu5UC" +
  "Gk17iwEnT3de0CBnfG3FzKYJ189pmjNtkqIPzgBGlzkXzZ/+/J/fgD9diLw23hUEIGm3R5Gc1cjTYb3VyFOkdJufM/78pl1t0W5b" +
  "lzdJM3IthCs9LgBAU0OdWYZBYGJ3KBH/z/9+sPSHv7r27p98fOiEKIpA2akLnzKhBk4dRF6jsx+TEzOYCcFu5AAAdiNnJiRNcEBf" +
  "pJho1+sPJemUnIasrNQOACh3lUjSLsNyXZB25fn39uVrjhw/rWbwxLpKlaExBMSlCW8UZzhp6S6JCQOGtlXOFCllVEZzSJqCiwKk" +
  "3Y8PnQhF4nJHB3wYqmS8xziOh718QNo9pVe37koklR2UbVZqWmM9nDGI/EUwJtsYAscEl5kDALjMnKQ/ZDylDycRUDy5XZBWzDDg" +
  "w+AssWKoxMfGkzTsXJkeH+498sDSm2orR6UfZjYaPCNYtLZjwy/rqz3pnXpeXL/l2XWvwzsIAVTbMshRpw7oRlkZAMAoK6MDOkkz" +
  "HV8UA0VFu2maqplNxrqqcofdLNlyPEmn+vww2gXp3TXPdnkVafdcGn1kYDSQ6XMaDMsRBA5vHwTQ2FStcbS0l+yA2flQy/OvaDeh" +
  "l8sLF2aSAQDQ4wsyrPT2otFIjC4vlbNCD4ZjsN+t8lOtq09xYw1DEZfMJENA5AvSqBHsFIchop2S5pmOfiLfv7s+A15gZWiXMpBu" +
  "h63UIa0lDoSgGwNQafOWfoxOp0MQPZwriDxvM4HLOGsBi4Ef46ItUg2DRSD2hvGio90ubyCakDHEwbHLJtZaKaOkb2x7Vx9carmC" +
  "ZFM7CIj8sn+kOen0rpXkKx0pq1TDYJpFukMYKDba7ej2JRIpuZffijKnJCOwHN8nvxcHoRUOmTpACAiQN20mkLiMIQ6OiZMqkriU" +
  "CQ7D6rqCxRfttrZ1y4kZdDpdZbkLtlCDgIAAKgrV5DRkBCKMtqcIqYbBed1CDWSsZAAA9Icicocmjq1EpCr+ovFkd18/XGoQEBDn" +
  "Wv+GE3oZg38wrTYuWTociue9eiyTaBcA0NkbEATp3XYUQSS9x6LxJJQxQEBAAHWaBAyRZpjeMFYAXzwT2vX3h1mOA9qqioOwhRoE" +
  "BMT5HIqLQATarMvwIqXd0x29KTnpB9Bc2wYBAVGc6A5hNKuhzJfldf5osUa7Xn8onqDVj+d4HnqPQUBAXICuIM6wOk0u4wVQK5Eh" +
  "7e5ubgnHEhpol+N9/RG4yCAKA+5SO4oicB6yRyCGhrX05kly+mAMKVLa1WpYnqSZti4vXGQjhvTNRjWhqaHOSOKKj1V/MSWRSkss" +
  "amg3jXsJBPinhiwU1yCmCifQQBwFRUu7mpIGSTrlhSY4YEQ9JAV1juklNir9GKvFJNkEGpzXGkuIRBPFM71jazySDVbOnxORTrFw" +
  "KQLlXTUNudoYrZeT+hYF7QZCEbmmakMRisQ/PnQCrrARjSNUWBubjOTEsVXpxzSOr7GZTQqP1RQTisaLZGIXXjV16sQxisNYjvPD" +
  "bWSgxpkB05QLLoxvnSHttnf7GIaDMoZLl3ZVzDmOoXOuaEg/ZvblE0glU8doLNl6trsYZpUyGR5adkupCvu3RDJ16kwnXIdAWbqL" +
  "s7xOvY1DUdNuXyCkXkMGk1wjj9PtvXL+nIMxtaFu5Yq75I7ed8f1s6ZOUEPxrW2FT7vTGus3PPf4nOmTJAuCwBCb06On2uA6VIQ/" +
  "irKcTqWMoSdcILSLZmoL64vGE3IdgsH5Htg9l0DD4DJXyUurV2R8Os8Jb+9sfufvB/Llvh79/Gw8QeNKN4gksO8tvZEykavWbryg" +
  "nuXfH/i3h5bdYpHykwPne8udaG3PwUJE0VsWzJg3qzHjT+j2Bv7rvzdkFYPodTOmjBu6TigjWV9TUV3hlvQbkcSp0x3F8CgCuTA7" +
  "j7N6IyEAFcXEbf6LrB7T68HsMbGBVm8gw25G6JYjdjTjvfJYXJV0l2W5S8Hysb7GU1/jyfh0huW6+gJ5RLsf7j3i9QfVPBcpk+GB" +
  "O2/8xqK5pzt6vmzr4QWh2uMeW+MpsVJqwrpYgm7+7PPsL5gksEXzp4Ps2oBmSbsogsydMTn770KnmE+OnIKUqgYRGknQCKCU38yi" +
  "KX0wcZH30zBEvKExK3VAez++86Ql86/R6w9OHFupOCxBp/xBKNoFIy9m2HfoRH1NhWSDJTDEOs5mMTU11DU11GleBr5gM6SY89HR" +
  "4397RzOcB5VN1YIJpEqVjAENJ5Cizu0CALp6/WqGFc9+y6WGHfv+EQgN7wNPEMQ9B47Ct+kLrKXf33MQzomGJ3dIVcbWF0HzvYVa" +
  "Dmg3TVO1873HEnAJqsfpth6GyY3ec+uO/QdbvhBFEQxjWOfb+NZOeNcG48u27vWvb4fzAHLRVG0wvBGsYL6yfrgJAroxXET8cfN7" +
  "Xn9w+MK6rTv2H8hFYrdgEI7GX9647eRpKB3TEsCF8ZSSM4MggMJwY8iWdr2BUCxJK25zw/q04dlRVaW5+eCjw399c+dwlEuJorj3" +
  "02O/+N1meC/AIMund/5+4E+vvQ+nQhO6+vEUp0BEKV7vi6KQdsGBzz5XLAllWK4HNpXQAl4Q1NT1yrVnHopVaze88f4+XhBye52n" +
  "znStfnET9FAezLmvvb3nwZUvwKnQCl8Mi9BKtMvo2mG0CwCIxZPBcExRPdYGGwYPg6mmkcTVqw4e+8W6D/ceziHzdvT4Vj77Ckwv" +
  "DP4tPPenNyDnZoZwAonRCpFsJIWE4gik3YHm7X6l/TTYQg1oNdVUfJgBAGwWakxVmXpSuO8/ntv41k41W6CKuYVDx1rvffw3H3x0" +
  "GN6sgQn5x4nT9zz27M9f2AhnA2TaVM0XUaDdwmihlhvaDQSjck3VvnqOxRK7m1vgwtIENSaZRgMxZUKNpnBs+ZO/fXT1H8509Gas" +
  "bYjEEi9v2rb4/qdhnAsAoFPsoWOtD/70hbl3Pr593xE4IVm95CmpFLoLxQQHZFMcDL7qZelnWDaNVYoaHyyIC/DJkVPXzJqS3oAG" +
  "RZCrp0+mTAZN2dX1f9u+/m/bl39r8d23XVNXXa7oXnguoPMHI9t2fvrLlzYXsy6FTjEMy/X6gida23c3H3317d0wtQ1y18tSEIBe" +
  "PgjsCGKF9H111savw7tehBhfW3HjvGlzZ0yur/FYKCNJ4udYWBRFOsUkaKaty3uwpXXL9v3wlQUCIof4f7sn871+iEwSAAAAAElF" +
  "TkSuQmCC",
  "base64",
);
